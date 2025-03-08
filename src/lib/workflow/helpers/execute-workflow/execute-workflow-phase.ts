import "server-only";

import createLogCollector from "@/lib/workflow/helpers/execute-workflow/log";
import { Database } from "@/lib/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { Edge } from "@xyflow/react";
import { Logger } from "next-axiom";
import { populatePhaseContext } from "./context";
import executePhase from "./execute-phase";
import finalizePhase from "./finalize-phase";
import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import {
  ExecutionPhaseContext,
  WorkflowExecutionPhase,
} from "@/lib/types/execution";
import { WorkflowNode } from "@/lib/types/workflow";

export default async function executeWorkflowPhase(
  supabase: SupabaseClient<Database>,
  userId: string,
  phase: WorkflowExecutionPhase,
  phaseContext: ExecutionPhaseContext,
  edges: Edge[],
  log: Logger,
) {
  // Create a log collector for each phase.
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //                 ***THESE LOGS ARE AVAILABLE TO THE USER***
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //                          ***NO SENSITIVE DETAILS***
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const logCollector = createLogCollector();
  const startedAt = new Date().toISOString();
  const promises = [];

  for (const task of phase.tasks) {
    const node = JSON.parse(task.node as string) as WorkflowNode;
    populatePhaseContext(
      node,
      edges,
      phaseContext,
      logCollector,
      log,
      task.taskId,
    );

    const inputKeys = Object.keys(phaseContext.tasks[node.id].inputs);
    const inputs =
      inputKeys.length > 0
        ? // Using the inputs from phaseContext rather than directly from task,
          // because the phaseContext only includes inputs provided by the user
          // rather than inputs provided by the user AND source nodes.
          JSON.stringify(phaseContext.tasks[node.id].inputs)
        : // Prevent inserting empty objects into database
          null;

    const taskPromise = supabase
      .from("tasks")
      .update({
        status: "EXECUTING",
        startedAt,
        inputs,
      })
      .eq("userId", userId)
      .eq("taskId", task.taskId);

    promises.push(taskPromise);
  }

  const results = await Promise.allSettled(promises);

  const errors = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      if (result.value.error) {
        errors.push(result.value.error);
      }
    }

    if (result.status === "rejected") {
      errors.push(result.reason);
    }
  }

  if (errors.length > 0) {
    // TODO: Handle errors
    log.error(LOGGER_ERROR_MESSAGES.Update, { errors });
  }

  const phaseResults = await executePhase(
    phase,
    phaseContext,
    logCollector,
    log,
  );

  await finalizePhase(
    supabase,
    userId,
    phaseResults,
    phaseContext,
    logCollector,
    log,
  );

  let success: boolean | "partial" = true;

  const hasSuccess = phaseResults.some((result) => result.success);
  const hasFailure = phaseResults.some((result) => !result.success);

  if (hasSuccess && hasFailure) {
    success = "partial";
  } else if (!hasSuccess) {
    success = false;
  }

  return { success };
}
