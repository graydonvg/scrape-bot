import "server-only";

import { LogCollector } from "@/lib/types/log";
import { executorRegistry } from "../../executors/executor-registry";
import { createExecutionContext } from "./context";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import {
  ExecutionPhaseContext,
  PhaseResult,
  WorkflowExecutionPhase,
} from "@/lib/types/execution";
import { WorkflowNode } from "@/lib/types/workflow";
import { taskRegistry } from "../../tasks/task-registry";

export default async function executePhase(
  phase: WorkflowExecutionPhase,
  phaseContext: ExecutionPhaseContext,
  logCollector: LogCollector,
  log: Logger,
) {
  log = log.with({ function: "executePhase" });

  try {
    const phaseResults: PhaseResult[] = [];
    const executorPromises = [];

    for (const task of phase.tasks) {
      const node = JSON.parse(task.node as string) as WorkflowNode;
      const creditsConsumed = taskRegistry[node.data.type].credits;
      const executorFn = executorRegistry[node.data.type];

      if (!executorFn) {
        logCollector.ERROR(task.taskId, "Task executor not found");
        log.error("Task executor not found");

        phaseResults.push({
          success: false,
          errorType: "internal",
          taskId: task.taskId,
          nodeId: node.id,
          creditsConsumed,
        });
        continue; // Skip adding an invalid task to promises
      }

      const executionContext = createExecutionContext(
        node,
        phaseContext,
        logCollector,
      );

      // Wrap the promise to keep track of the task details
      const executorPromise: Promise<PhaseResult> = executorFn(
        task.taskId,
        executionContext,
        log,
      )
        .then((result) => {
          if (!result.success) {
            return {
              success: false,
              errorType: result.errorType,
              taskId: task.taskId,
              nodeId: node.id,
              creditsConsumed,
            };
          }
          return {
            success: true,
            taskId: task.taskId,
            nodeId: node.id,
            creditsConsumed,
          };
        })
        .catch((error) => ({
          success: false,
          errorType: "internal",
          taskId: task.taskId,
          nodeId: node.id,
          creditsConsumed,
          error,
        }));

      executorPromises.push(executorPromise);
    }

    const executorPromiseResults = await Promise.allSettled(executorPromises);

    for (const result of executorPromiseResults) {
      if (
        result.status === "fulfilled" &&
        (result.value.success || result.value?.errorType === "user")
      ) {
        // The promise is fulfilled and the executor function ran successfully.
        if (result.value?.errorType === "user") {
          // If an error occurs and the fault lies with the user (invalid input),
          // credits must still be deducted since the task was executed.
          // success = false to indicate to the user that an error occured
          // even though the task is considered 'successful'
          phaseResults.push({
            success: false,
            errorType: "user",
            taskId: result.value.taskId,
            nodeId: result.value.nodeId,
            creditsConsumed: result.value.creditsConsumed,
          });
        } else {
          // The task was executed successfully.
          phaseResults.push({
            success: true,
            taskId: result.value.taskId,
            nodeId: result.value.nodeId,
            creditsConsumed: result.value.creditsConsumed,
          });
        }
      } else if (result.status === "fulfilled") {
        // The promise is fulfilled but the executor function encountered an error.
        // These errors will be logged in the executor functions.
        // This is just to update the phase results.

        phaseResults.push({
          success: false,
          errorType: "internal",
          taskId: result.value.taskId,
          nodeId: result.value.nodeId,
          creditsConsumed: result.value.creditsConsumed,
        });
      } else {
        // The promise rejected.
        logCollector.ERROR(result.reason.taskId, userErrorMessages.Unexpected);
        log.error("Executor promise rejected", { error: result.reason });

        phaseResults.push({
          success: false,
          errorType: "internal",
          taskId: result.reason.taskId,
          nodeId: result.reason.nodeId,
          creditsConsumed: result.reason.creditsConsumed,
        });
      }
    }

    return phaseResults;
  } catch (error) {
    log.error(loggerErrorMessages.Unexpected, { error });
    throw error;
  }
}
