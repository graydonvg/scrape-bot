import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";
import { Logger } from "next-axiom";

export default async function getWorkflowExecutionWithPhasesClient(
  workflowExecutionId: string,
) {
  let log = new Logger();
  log = log.with({
    context: "getWorkflowExecutionWithPhasesClient",
    workflowExecutionId,
  });

  try {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      log.warn(LOGGER_ERROR_MESSAGES.Unauthorized);
      return null;
    }

    log = log.with({ userId: user.id });

    const { data, error } = await supabase
      .from("workflowExecutions")
      .select("*, executionPhases(*)")
      .eq("userId", user.id)
      .eq("workflowExecutionId", workflowExecutionId)
      .order("phase", { ascending: true, referencedTable: "executionPhases" });

    if (error) {
      log.error(LOGGER_ERROR_MESSAGES.Select, {
        error,
      });
      return null;
    }

    return data[0];
  } catch (error) {
    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return null;
  } finally {
    log.flush();
  }
}
