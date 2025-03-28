import "server-only";

import { loggerErrorMessages } from "@/lib/constants";
import { Database } from "@/lib/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { Logger } from "next-axiom";

export default async function initializeWorkflowExecution(
  supabase: SupabaseClient<Database>,
  userId: string,
  workflowId: string,
  executionId: string,
  log: Logger,
  nextExecutionAt?: string,
) {
  log = log.with({ function: "initializeWorkflowExecution" });

  try {
    const workflowExecutionsPromise = supabase
      .from("workflowExecutions")
      .update({ startedAt: new Date().toISOString(), status: "EXECUTING" })
      .eq("userId", userId)
      .eq("workflowExecutionId", executionId);

    const workflowsPromise = supabase
      .from("workflows")
      .update({
        lastExecutionId: executionId,
        lastExecutedAt: new Date().toISOString(),
        lastExecutionStatus: "EXECUTING",
        ...(nextExecutionAt && { nextExecutionAt }),
      })
      .eq("userId", userId)
      .eq("workflowId", workflowId);

    const tasksPromise = supabase
      .from("tasks")
      .update({
        status: "PENDING",
      })
      .eq("userId", userId)
      .eq("workflowExecutionId", executionId);

    const results = await Promise.allSettled([
      workflowExecutionsPromise,
      workflowsPromise,
      tasksPromise,
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
      log.error(loggerErrorMessages.Update, { errors });
    }
  } catch (error) {
    log.error(loggerErrorMessages.Unexpected, { error });
    throw error;
  }
}
