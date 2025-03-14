import "server-only";

import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { Logger } from "next-axiom";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function getAllWorkflowExecutionsServer(
  workflowId: string,
) {
  let log = new Logger();
  log = log.with({
    context: "getAllWorkflowExecutions",
    workflowId,
  });

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      log.warn(LOGGER_ERROR_MESSAGES.Unauthorized);
      return redirect("/signin");
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
      .range(0, 4);

    if (error) {
      log.error(LOGGER_ERROR_MESSAGES.Select, {
        error,
      });
      return null;
    }

    return { workflowExecutions, count };
  } catch (error) {
    // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
    // Throw the “error” to trigger the redirection
    if (isRedirectError(error)) throw error;

    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return null;
  }
}
