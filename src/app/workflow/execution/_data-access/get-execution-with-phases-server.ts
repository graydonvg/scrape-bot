import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { Logger } from "next-axiom";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export default async function getWorkflowExecutionWithPhasesServer(
  workflowExecutionId: string,
) {
  let log = new Logger();
  log = log.with({
    context: "getWorkflowExecutionWithPhasesServer",
    workflowExecutionId,
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
    // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
    // Throw the “error” to trigger the redirection
    if (isRedirectError(error)) throw error;

    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return null;
  }
}
