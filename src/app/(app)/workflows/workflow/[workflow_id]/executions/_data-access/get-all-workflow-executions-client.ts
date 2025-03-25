import { loggerErrorMessages } from "@/lib/constants";
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
      log.warn(loggerErrorMessages.Unauthorized);
      return null;
    }

    log = log.with({ userId: user.id });

    const {
      data: workflowExecutions,
      count,
      error,
    } = await supabase
      .from("workflowExecutions")
      .select("*, tasks(taskId), ...workflows!inner(workflowName:name)", {
        count: "exact",
      })
      .eq("userId", user.id)
      .eq("workflowId", workflowId)
      .order("startedAt", { ascending: false })
      .order("phase", { ascending: true, referencedTable: "tasks" })
      .limit(1, { foreignTable: "tasks" })
      .range(rangeStart, rangeEnd);

    if (error) {
      log.error(loggerErrorMessages.Select, {
        error,
      });
      return null;
    }

    return { workflowExecutions, count };
  } catch (error) {
    log.error(loggerErrorMessages.Unexpected, { error });
    return null;
  } finally {
    log.flush();
  }
}
