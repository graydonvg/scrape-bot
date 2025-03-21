"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { actionClient } from "@/lib/safe-action";
import {
  executeWorkflowSchema,
  ExecuteWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import { Logger } from "next-axiom";
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from "@/lib/constants";
import buildWorkflowExecutionPlan from "@/lib/workflow/helpers/build-workflow-execution-plan";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import executeWorkflow from "@/lib/workflow/helpers/execute-workflow/execute-workflow";
import { taskRegistry } from "@/lib/workflow/tasks/task-registry";
import { ActionReturn } from "@/lib/types/action";
import { TaskDb } from "@/lib/types/task";
import { WorkflowNode } from "@/lib/types/workflow";
import { calculateTotalCreditsRequired } from "@/lib/utils";

const executeWorkflowAction = actionClient
  .metadata({ actionName: "executeWorkflowAction" })
  .schema(executeWorkflowSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: ExecuteWorkflowSchemaType;
    }): Promise<ActionReturn> => {
      let log = new Logger();
      log = log.with({ context: "executeWorkflowAction" });

      try {
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          log.warn(LOGGER_ERROR_MESSAGES.Unauthorized, { formData });
          redirect("/signin");
        }

        log = log.with({ userId: user.id });

        const workflowId = formData.workflowId;
        const workflowDefinition = JSON.parse(formData.definition);
        const { nodes, edges } = workflowDefinition;
        const result = buildWorkflowExecutionPlan(nodes, edges);

        if (result.error) {
          log.error("Workflow definition is invalid", { error: result.error });
          return {
            success: false,
            message: "Workflow definition is invalid",
          };
        }

        if (!result.executionPlan) {
          log.error("No execution plan generated");
          return {
            success: false,
            message: "No execution plan generated",
          };
        }

        const executionPlan = result.executionPlan;

        const { data: selectCreditsData, error: selectCreditsError } =
          await supabase.from("users").select("credits").eq("userId", user.id);

        if (selectCreditsError) {
          log.error(LOGGER_ERROR_MESSAGES.Select, {
            error: selectCreditsError,
          });
          return {
            success: false,
            message: USER_ERROR_MESSAGES.Unexpected,
          };
        }

        const totalCreditsRequired =
          calculateTotalCreditsRequired(executionPlan);

        if (selectCreditsData[0].credits < totalCreditsRequired) {
          return {
            success: false,
            message: USER_ERROR_MESSAGES.InsufficientCredits,
          };
        }

        const {
          data: workflowExecutionData,
          error: insertWorkflowExecutionError,
        } = await supabase
          .from("workflowExecutions")
          .insert({
            workflowId,
            status: "PENDING",
            trigger: "MANUAL",
            startedAt: new Date().toISOString(),
            definition: JSON.stringify(workflowDefinition),
          })
          .select("workflowExecutionId");

        if (insertWorkflowExecutionError) {
          log.error(LOGGER_ERROR_MESSAGES.Insert, {
            error: insertWorkflowExecutionError,
          });
          return {
            success: false,
            message: USER_ERROR_MESSAGES.Unexpected,
          };
        }

        const workflowExecutionId =
          workflowExecutionData[0].workflowExecutionId;

        const tasksToInsert = executionPlan.flatMap((plan) => {
          return plan.nodes.flatMap((node: WorkflowNode) => {
            return {
              workflowExecutionId,
              status: "CREATED",
              phase: plan.phase,
              node: JSON.stringify(node),
              name: taskRegistry[node.data.type].label,
            } as TaskDb;
          });
        });

        const { error: insertTaskError } = await supabase
          .from("tasks")
          .insert(tasksToInsert);

        if (insertTaskError) {
          log.error(LOGGER_ERROR_MESSAGES.Insert, {
            error: insertTaskError,
          });
          return {
            success: false,
            message: USER_ERROR_MESSAGES.Unexpected,
          };
        }

        executeWorkflow(supabase, user.id, workflowId, workflowExecutionId); // runs in the background

        redirect(
          `/workflows/workflow/${workflowId}/execution/${workflowExecutionId}`,
        );
      } catch (error) {
        // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
        // Throw the “error” to trigger the redirection
        if (isRedirectError(error)) throw error;

        log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
        return {
          success: false,
          message: USER_ERROR_MESSAGES.Unexpected,
        };
      }
    },
  );

export default executeWorkflowAction;
