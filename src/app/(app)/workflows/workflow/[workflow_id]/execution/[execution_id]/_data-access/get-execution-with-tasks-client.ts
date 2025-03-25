import { loggerErrorMessages } from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser";
import { Logger } from "next-axiom";

export default async function getWorkflowExecutionWithTasksClient(
  workflowExecutionId: string,
) {
  let log = new Logger();
  log = log.with({
    context: "getWorkflowExecutionWithTasksClient",
    workflowExecutionId,
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

    const { data, error } = await supabase
      .from("workflowExecutions")
      .select("*, tasks(*), workflows(name)")
      .eq("userId", user.id)
      .eq("workflowExecutionId", workflowExecutionId)
      .order("phase", { ascending: true, referencedTable: "tasks" })
      .order("completedAt", { referencedTable: "tasks", ascending: true });

    if (error) {
      log.error(loggerErrorMessages.Select, {
        error,
      });
      return null;
    }

    return data[0];
  } catch (error) {
    log.error(loggerErrorMessages.Unexpected, { error });
    return null;
  } finally {
    log.flush();
  }
}
