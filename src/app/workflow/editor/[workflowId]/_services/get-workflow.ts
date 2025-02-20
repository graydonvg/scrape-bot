import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { Logger } from "next-axiom";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { cache } from "react";

const getWorkflow = cache(async (workflowId: number) => {
  let log = new Logger();
  log = log.with({ context: "getWorkflow" });

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      log.warn(LOGGER_ERROR_MESSAGES.Unauthorized);
      return redirect("/signin");
    }

    const { data, error } = await supabase
      .from("workflows")
      .select("*")
      .eq("userId", user.id)
      .eq("workflowId", workflowId);

    if (error) {
      log.error(LOGGER_ERROR_MESSAGES.Select, {
        error,
      });
      return null;
    }

    return data[0];
  } catch (error) {
    if (isRedirectError(error)) throw error;

    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return null;
  }
});

export default getWorkflow;
