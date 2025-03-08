import "server-only";

import { LogCollector } from "@/lib/types/log";
import { executorRegistry } from "../../executors/executor-registry";
import { createExecutionContext } from "./context";
import { Logger } from "next-axiom";
import { USER_ERROR_MESSAGES } from "@/lib/constants";
import {
  ExecutionPhaseContext,
  WorkflowExecutionPhase,
} from "@/lib/types/execution";
import { WorkflowNode } from "@/lib/types/workflow";

export default async function executePhase(
  phase: WorkflowExecutionPhase,
  phaseContext: ExecutionPhaseContext,
  logCollector: LogCollector,
  log: Logger,
) {
  const phaseResults = [];
  const promises = [];

  for (const task of phase.tasks) {
    const node = JSON.parse(task.node as string) as WorkflowNode;
    const executorFn = executorRegistry[node.data.type];

    if (!executorFn) {
      logCollector.ERROR(task.taskId, "Task executor not found");
      log.error("Task executor not found");

      phaseResults.push({
        taskId: task.taskId,
        nodeId: node.id,
        success: false,
      });
      continue; // Skip adding an invalid task to promises
    }

    const executionContext = createExecutionContext(
      node,
      phaseContext,
      logCollector,
    );

    // Wrap the promise to keep track of the taskId and nodeId
    const promise = executorFn(task.taskId, executionContext, log)
      .then((result) => ({
        success: result.success,
        taskId: task.taskId,
        nodeId: node.id,
      }))
      .catch((error) => ({
        success: false,
        taskId: task.taskId,
        nodeId: node.id,
        error,
      }));

    promises.push(promise);
  }

  const promiseResults = await Promise.allSettled(promises);

  for (const result of promiseResults) {
    if (result.status === "fulfilled") {
      if (result.value.success) {
        phaseResults.push({
          success: true,
          taskId: result.value.taskId,
          nodeId: result.value.nodeId,
        });
      } else {
        // These errors will be logged in the executor functions.
        // This is just to update the phase results.
        phaseResults.push({
          success: false,
          taskId: result.value.taskId,
          nodeId: result.value.nodeId,
        });
      }
    }

    if (result.status === "rejected") {
      logCollector.ERROR(result.reason.taskId, USER_ERROR_MESSAGES.Unexpected);
      log.error("Executor promise rejected", { error: result.reason });

      phaseResults.push({
        taskId: result.reason.taskId,
        nodeId: result.reason.nodeId,
        success: false,
      });
    }
  }

  return phaseResults;
}
