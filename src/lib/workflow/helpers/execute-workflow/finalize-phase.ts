import "server-only";

import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import { Database } from "@/lib/supabase/database.types";
import { LogCollector } from "@/lib/types/log";
import { SupabaseClient } from "@supabase/supabase-js";
import { Logger } from "next-axiom";
import { ExecutionPhaseContext, PhaseResult } from "@/lib/types/execution";

export default async function finalizePhase(
  supabase: SupabaseClient<Database>,
  userId: string,
  phaseResults: PhaseResult[],
  phaseContext: ExecutionPhaseContext,
  logCollector: LogCollector,
  log: Logger,
) {
  log = log.with({ function: "finalizePhase" });

  const taskPromises = phaseResults.map((result) => {
    const outputKeys = Object.keys(phaseContext.tasks[result.nodeId].outputs);
    const outputs =
      outputKeys.length > 0 && result.success && result.creditsConsumed > 0
        ? JSON.stringify(phaseContext.tasks[result.nodeId].outputs)
        : null;

    return supabase
      .from("tasks")
      .update({
        status: result.success ? "COMPLETED" : "FAILED",
        completedAt: new Date().toISOString(),
        outputs,
        creditsConsumed: result.creditsConsumed,
      })
      .eq("userId", userId)
      .eq("taskId", result.taskId);
  });

  const logs = logCollector.getAll();

  const logPromises =
    logs.length > 0
      ? supabase.from("taskLogs").insert(logCollector.getAll())
      : null;

  const promiseResults = logPromises
    ? await Promise.allSettled([...taskPromises, logPromises])
    : await Promise.allSettled(taskPromises);

  const errors = [];

  for (const result of promiseResults) {
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
}
