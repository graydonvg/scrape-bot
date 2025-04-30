import "server-only";

import { loggerErrorMessages } from "@/lib/constants";
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
      log.warn(loggerErrorMessages.Unauthorized);
      redirect("/signin");
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
      .limit(5);

    if (error) {
      log.error(loggerErrorMessages.Select, {
        error,
      });
      return null;
    }

    return { workflowExecutions, count };
  } catch (error) {
    // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
    // Throw the “error” to trigger the redirection
    if (isRedirectError(error)) throw error;

    log.error(loggerErrorMessages.Unexpected, { error });
    return null;
  }
}
