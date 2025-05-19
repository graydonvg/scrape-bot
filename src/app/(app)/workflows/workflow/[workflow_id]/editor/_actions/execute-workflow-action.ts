"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { actionClient } from "@/lib/safe-action";
import {
  executeWorkflowSchema,
  ExecuteWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import buildWorkflowExecutionPlan from "@/lib/workflow/helpers/build-workflow-execution-plan";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import executeWorkflow from "@/lib/workflow/helpers/execute-workflow/execute-workflow";
import { taskRegistry } from "@/lib/workflow/tasks/task-registry";
import { ActionReturn } from "@/lib/types/action";
import { TaskDb } from "@/lib/types/task";
import { WorkflowNode } from "@/lib/types/workflow";
import { calculateTotalCreditCostFromExecutionPlan } from "@/lib/utils";
import { WorkflowExecutionPlan } from "@/lib/types/execution";
import createSupabaseService from "@/lib/supabase/supabase-service";

const executeWorkflowAction = actionClient
  .metadata({ actionName: "executeWorkflowAction" })
  .schema(executeWorkflowSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: ExecuteWorkflowSchemaType;
    }): Promise<ActionReturn> => {
      let log = new Logger().with({ context: "executeWorkflowAction" });

      try {
        const supabaseService = createSupabaseService();
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          log.warn(loggerErrorMessages.Unauthorized, { formData });
          redirect("/signin");
        }

        log = log.with({ userId: user.id });

        const workflowId = formData.workflowId;

        const {
          data: selectPublishedWorkflowData,
          error: selectPublishedWorkflowError,
        } = await supabase
          .from("workflows")
          .select("executionPlan, definition")
          .eq("userId", user.id)
          .eq("workflowId", workflowId)
          .eq("status", "PUBLISHED");

        if (selectPublishedWorkflowError) {
          log.error(loggerErrorMessages.Select, {
            error: selectPublishedWorkflowError,
          });
          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        let executionPlan: WorkflowExecutionPlan[];
        let workflowDefinition: string;

        if (
          selectPublishedWorkflowData.length > 0 &&
          selectPublishedWorkflowData[0].definition &&
          selectPublishedWorkflowData[0].executionPlan
        ) {
          // If the workflow is published, use the data from the database
          const { executionPlan: workflowExecutionPlan, definition } =
            selectPublishedWorkflowData[0];

          const publishedWorkflowExecutionPlan = JSON.parse(
            workflowExecutionPlan as string,
          ) as WorkflowExecutionPlan[];

          executionPlan = publishedWorkflowExecutionPlan;
          workflowDefinition = definition as string;
        } else {
          // If the workflow is unpublished, use the submitted form data
          if (!formData.definition) {
            log.error("Workflow definition is missing");
            return {
              success: false,
              message: "Workflow definition is missing",
            };
          }

          workflowDefinition = formData.definition;
          const parsedDefinition = JSON.parse(formData.definition);
          const { nodes, edges } = parsedDefinition;
          const result = buildWorkflowExecutionPlan(nodes, edges);

          if (result.error) {
            log.error("Workflow definition is invalid", {
              error: result.error,
            });
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

          executionPlan = result.executionPlan;
        }

        const totalCreditsRequired =
          calculateTotalCreditCostFromExecutionPlan(executionPlan);

        // A stored procedure that retrieves the current available credits for the user.
        // It checks if the user has enough credits to deduct the specified amount.
        // If not, it returns false.
        // If the user has enough credits, it deducts the amount from availableCredits and
        // adds it to reservedCredits.
        // The function returns true if the operation is successful.
        // If the entire process is successful, the user's credit balance will be finalized.
        // If a server error occurs, the user will be refunded.
        const { data: reserveCreditsSuccess, error: reserveCreditsError } =
          await supabaseService.rpc("reserve_credits_for_workflow_execution", {
            p_user_id: user.id,
            p_amount: totalCreditsRequired,
          });

        if (reserveCreditsError) {
          log.error(loggerErrorMessages.Update, {
            error: reserveCreditsError,
          });
          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        if (!reserveCreditsSuccess) {
          return {
            success: false,
            message: userErrorMessages.InsufficientCredits,
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
            definition: workflowDefinition,
          })
          .select("workflowExecutionId");

        if (insertWorkflowExecutionError) {
          log.error(loggerErrorMessages.Insert, {
            error: insertWorkflowExecutionError,
          });
          return {
            success: false,
            message: userErrorMessages.Unexpected,
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
          log.error(loggerErrorMessages.Insert, {
            error: insertTaskError,
          });
          return {
            success: false,
            message: userErrorMessages.Unexpected,
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

        log.error(loggerErrorMessages.Unexpected, { error });
        return {
          success: false,
          message: userErrorMessages.Unexpected,
        };
      }
    },
  );

export default executeWorkflowAction;
