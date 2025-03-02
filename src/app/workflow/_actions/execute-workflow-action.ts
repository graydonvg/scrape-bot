"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { actionClient } from "@/lib/safe-action";
import {
  executeWorkflowSchema,
  ExecuteWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import {
  ActionReturn,
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
} from "@/lib/types";
import { Logger } from "next-axiom";
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from "@/lib/constants";
import buildWorkflowExecutionPlan from "@/lib/workflow/helpers/build-workflow-execution-plan";
import { taskRegistry } from "@/lib/workflow/task-registry";

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
          return {
            success: false,
            message: USER_ERROR_MESSAGES.Unauthorized,
          };
        }

        log = log.with({ userId: user.id });

        // const { data: selectWorkflowsData, error: selectWorkflowsError } =
        //   await supabase
        //     .from("workflows")
        //     .select("definition")
        //     .eq("userId", user.id)
        //     .eq("workflowId", formData.workflowId);

        // if (selectWorkflowsError) {
        //   log.error(LOGGER_ERROR_MESSAGES.Select, {
        //     error: selectWorkflowsError,
        //     formData,
        //   });
        //   return {
        //     success: false,
        //     message: USER_ERROR_MESSAGES.Unexpected,
        //   };
        // }

        // const workflowDefinitionFromDatabase =
        //   selectWorkflowsData[0].definition;

        let executionPlan: WorkflowExecutionPlan[] = [];
        if (!formData.definition) {
          return {
            success: false,
            message: "Workflow definition is undefined",
          };
        }

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

        executionPlan = result.executionPlan;

        const { data: workflowExecutionsData, error: workflowExecutionsError } =
          await supabase
            .from("workflowExecutions")
            .insert({
              workflowId: formData.workflowId,
              status: "PENDING",
              trigger: "MANUAL",
              startedAt: new Date().toISOString(),
              creditsConsumed: 5,
            })
            .select("workflowExecutionId");

        if (workflowExecutionsError) {
          log.error(LOGGER_ERROR_MESSAGES.Insert, {
            error: workflowExecutionsError,
          });
          return {
            success: false,
            message: USER_ERROR_MESSAGES.Unexpected,
          };
        }

        const executionPhases = executionPlan.flatMap((plan) => {
          return plan.nodes.flatMap((node) => {
            return {
              workflowExecutionId:
                workflowExecutionsData[0].workflowExecutionId,
              status: "CREATED" as ExecutionPhaseStatus,
              phase: plan.phase,
              node: JSON.stringify(node),
              taskName: taskRegistry[node.data.type].label,
            };
          });
        });

        const { data: executionPhasesData, error: executionPhasesError } =
          await supabase
            .from("executionPhases")
            .insert(executionPhases)
            .select("*");

        if (executionPhasesError) {
          log.error(LOGGER_ERROR_MESSAGES.Insert, {
            error: executionPhasesError,
          });
          return {
            success: false,
            message: USER_ERROR_MESSAGES.Unexpected,
          };
        }

        console.log("workflowExecutionsData", workflowExecutionsData);
        console.log("executionPhasesData", executionPhasesData);

        return {
          success: true,
          message: "Execution started",
        };
      } catch (error) {
        log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
        return {
          success: false,
          message: USER_ERROR_MESSAGES.Unexpected,
        };
      }
    },
  );

export default executeWorkflowAction;
