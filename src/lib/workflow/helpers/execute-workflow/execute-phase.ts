import "server-only";

import { LogCollector } from "@/lib/types/log";
import { executorRegistry } from "../../executors/executor-registry";
import { createExecutionContext } from "./context";
import { Logger } from "next-axiom";
import { USER_ERROR_MESSAGES } from "@/lib/constants";
import {
  ExecutionPhaseContext,
  PhaseResult,
  WorkflowExecutionPhase,
} from "@/lib/types/execution";
import { WorkflowNode } from "@/lib/types/workflow";
import { taskRegistry } from "../../tasks/task-registry";
import deductCredits from "./decrement-credits";
import { Database } from "@/lib/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export default async function executePhase(
  supabase: SupabaseClient<Database>,
  userId: string,
  phase: WorkflowExecutionPhase,
  phaseContext: ExecutionPhaseContext,
  logCollector: LogCollector,
  log: Logger,
) {
  const phaseResults: PhaseResult[] = [];
  const executorPromises = [];

  for (const task of phase.tasks) {
    const node = JSON.parse(task.node as string) as WorkflowNode;
    const creditsRequired = taskRegistry[node.data.type].credits;
    const executorFn = executorRegistry[node.data.type];

    if (!executorFn) {
      logCollector.ERROR(task.taskId, "Task executor not found");
      log.error("Task executor not found");

      phaseResults.push({
        success: false,
        taskId: task.taskId,
        nodeId: node.id,
        creditsConsumed: 0,
      });
      continue; // Skip adding an invalid task to promises
    }

    const executionContext = createExecutionContext(
      node,
      phaseContext,
      logCollector,
    );

    // Wrap the promise to keep track of the task details
    const executorPromise = executorFn(task.taskId, executionContext, log)
      .then((result) => ({
        success: result.success,
        taskId: task.taskId,
        nodeId: node.id,
        creditsConsumed: creditsRequired,
      }))
      .catch((error) => ({
        success: false,
        taskId: task.taskId,
        nodeId: node.id,
        creditsConsumed: 0,
        error,
      }));

    executorPromises.push(executorPromise);
  }

  const executorPromiseResults = await Promise.allSettled(executorPromises);

  for (const result of executorPromiseResults) {
    if (result.status === "fulfilled" && result.value.success) {
      // Credit balance gets checked client and server side before executing.
      // Deduct credits only if the task was executed successfully to
      // prevent deducting credits from the user if a server error occured.
      // If, for some unforeseen reason, the user runs out of credits during execution,
      // the user will not receive the results (outputs) of the executed task.
      const deductCreditsSuccess = await deductCredits(
        supabase,
        userId,
        result.value.taskId,
        result.value.creditsConsumed,
        logCollector,
        log,
      );

      if (deductCreditsSuccess) {
        phaseResults.push({
          success: true,
          taskId: result.value.taskId,
          nodeId: result.value.nodeId,
          creditsConsumed: result.value.creditsConsumed,
        });
      } else {
        phaseResults.push({
          success: false,
          taskId: result.value.taskId,
          nodeId: result.value.nodeId,
          creditsConsumed: 0,
        });
      }
    } else if (result.status === "fulfilled") {
      // These errors will be logged in the executor functions.
      // This is just to update the phase results.
      phaseResults.push({
        success: false,
        taskId: result.value.taskId,
        nodeId: result.value.nodeId,
        creditsConsumed: 0,
      });
    } else {
      logCollector.ERROR(result.reason.taskId, USER_ERROR_MESSAGES.Unexpected);
      log.error("Executor promise rejected", { error: result.reason });

      phaseResults.push({
        success: false,
        taskId: result.reason.taskId,
        nodeId: result.reason.nodeId,
        creditsConsumed: 0,
      });
    }
  }

  return phaseResults;
}
