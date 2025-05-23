import "server-only";

import { loggerErrorMessages } from "@/lib/constants";
import { Database } from "@/lib/supabase/database.types";
import { WorkflowExecutionStatusDb } from "@/lib/types/execution";
import { SupabaseClient } from "@supabase/supabase-js";
import { Logger } from "next-axiom";
import createSupabaseService from "@/lib/supabase/supabase-service";

export default async function finalizeWorkflowExecution(
  supabase: SupabaseClient<Database>,
  userId: string,
  workflowId: string,
  executionId: string,
  status: WorkflowExecutionStatusDb,
  creditsConsumed: number,
  totalCreditsToRefund: number,
  logger: Logger,
) {
  logger = logger.with({ function: "finalizeWorkflowExecution" });

  try {
    const supabaseService = createSupabaseService();

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

    // A stored procedure that retrieves the reservedCredits for the user and checks
    // if the sum of p_credits_consumed and p_credits_to_refund exceeds reservedCredits.
    // If the condition is not met, it returns an object indicating failure.
    // If the condition is met, it deducts the total from reservedCredits and adds
    // p_credits_to_refund to availableCredits.
    // Finally, it returns an object indicating success.
    const finalizeUserCreditsPromise = supabaseService.rpc(
      "finalize_user_credits",
      {
        p_user_id: userId,
        p_credits_consumed: creditsConsumed,
        p_credits_to_refund: totalCreditsToRefund,
      },
    );

    const results = await Promise.allSettled([
      workflowExecutionsPromise,
      workflowsPromise,
      finalizeUserCreditsPromise,
    ]);

    const errors = [];

    for (const result of results) {
      if (result.status === "fulfilled") {
        if (result.value.error) errors.push(result.value.error);

        if (result.value.data) {
          const finalizeUserCreditsResult = result.value.data as
            | { success: true }
            | { success: false; message: string };

          if (!finalizeUserCreditsResult.success) {
            // This should not happen.
            // The total cost of the worklfow is reserved before execution begin.
            // The sum of the credits consumed and credits to refund should always
            // equal the total cost of the worklfow.
            errors.push({ error: finalizeUserCreditsResult.message });
          }
        }
      }

      if (result.status === "rejected") errors.push(result.reason);
    }

    if (errors.length > 0) {
      // TODO: Handle errors
      logger.error(loggerErrorMessages.Update, { errors });
    }
  } catch (error) {
    logger.error(loggerErrorMessages.Unexpected, { error });
    throw error;
  }
}
