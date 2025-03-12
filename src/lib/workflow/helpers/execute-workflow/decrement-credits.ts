import { USER_ERROR_MESSAGES } from "@/lib/constants";
import { Database } from "@/lib/supabase/database.types";
import { LogCollector } from "@/lib/types/log";
import { SupabaseClient } from "@supabase/supabase-js";
import { Logger } from "next-axiom";

export default async function deductCredits(
  supabase: SupabaseClient<Database>,
  userId: string,
  taskId: string,
  amount: number,
  logCollector: LogCollector,
  log: Logger,
) {
  log = log.with({ function: "deductCredits" });

  try {
    const { data: success, error } = await supabase.rpc("update_user_credits", {
      p_user_id: userId,
      p_amount: -amount,
    });

    if (error) {
      logCollector.ERROR(taskId, USER_ERROR_MESSAGES.Unexpected);
      log.error("Failed to update user credit balance. Database error.", {
        error,
      });
      return false;
    }

    if (!success) {
      // Credit balance gets checked client and server side before executing,
      // so this should not happen.
      logCollector.ERROR(taskId, USER_ERROR_MESSAGES.InsufficientCredits);
      return false;
    }

    return true;
  } catch (error) {
    logCollector.ERROR(taskId, USER_ERROR_MESSAGES.Unexpected);
    log.error("Failed to update user credit balance. Unexpected error.", {
      error,
    });
    return false;
  }
}
