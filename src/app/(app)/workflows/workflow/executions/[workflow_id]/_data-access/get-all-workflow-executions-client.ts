import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import { Logger } from "next-axiom";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";

export default async function getAllWorkflowExecutionsClient(
  workflowId: string,
  rangeStart: number,
  rangeEnd: number,
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

    const {
      data: workflowExecutions,
      count,
      error,
    } = await supabase
      .from("workflowExecutions")
      .select("*, tasks(taskId)", { count: "exact" })
      .eq("userId", user.id)
      .eq("workflowId", workflowId)
      .order("startedAt", { ascending: false })
      .order("phase", { ascending: true, referencedTable: "tasks" })
      .limit(1, { foreignTable: "tasks" })
      .range(rangeStart, rangeEnd);

    if (error) {
      log.error(LOGGER_ERROR_MESSAGES.Select, {
        error,
      });
      return null;
    }

    return { workflowExecutions, count };
  } catch (error) {
    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return null;
  } finally {
    log.flush();
  }
}
