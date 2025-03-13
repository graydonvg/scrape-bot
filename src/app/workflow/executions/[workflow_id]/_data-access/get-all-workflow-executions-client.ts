import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import { Logger } from "next-axiom";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";

export default async function getAllWorkflowExecutionsClient(
  workflowId: string,
) {
  let log = new Logger();
  log = log.with({
    context: "getAllWorkflowExecutions",
    workflowId,
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
      .select("*, tasks(taskId)")
      .eq("userId", user.id)
      .eq("workflowId", workflowId)
      .order("startedAt", { ascending: false })
      .order("phase", { ascending: true, referencedTable: "tasks" })
      .limit(1, { foreignTable: "tasks" });

    if (error) {
      log.error(LOGGER_ERROR_MESSAGES.Select, {
        error,
      });
      return null;
    }

    return data;
  } catch (error) {
    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return null;
  } finally {
    log.flush();
  }
}
