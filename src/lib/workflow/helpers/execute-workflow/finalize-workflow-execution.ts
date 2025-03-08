import "server-only";

import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import { Database } from "@/lib/supabase/database.types";
import { WorkflowExecutionStatusDb } from "@/lib/types/execution";
import { SupabaseClient } from "@supabase/supabase-js";
import { Logger } from "next-axiom";

export default async function finalizeWorkflowExecution(
  supabase: SupabaseClient<Database>,
  userId: string,
  workflowId: string,
  executionId: string,
  status: WorkflowExecutionStatusDb,
  creditsConsumed: number,
  log: Logger,
) {
  const workflowExecutionsPromise = supabase
    .from("workflowExecutions")
    .update({
      status,
      completedAt: new Date().toISOString(),
      creditsConsumed,
    })
    .eq("userId", userId)
    .eq("workflowExecutionId", executionId);

  const workflowsPromise = supabase
    .from("workflows")
    .update({
      lastExecutionStatus: status,
    })
    .eq("userId", userId)
    .eq("workflowId", workflowId)
    .eq("lastExecutionId", executionId);

  const results = await Promise.allSettled([
    workflowExecutionsPromise,
    workflowsPromise,
  ]);

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
}
