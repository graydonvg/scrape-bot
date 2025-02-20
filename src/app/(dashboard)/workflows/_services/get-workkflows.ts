import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { Logger } from "next-axiom";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export default async function getWorkflows() {
  let log = new Logger();
  log = log.with({ context: "getWorkflows" });

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
      .order("createdAt", { ascending: true });

    if (error) {
      log.error(LOGGER_ERROR_MESSAGES.Select, {
        error,
      });
      return null;
    }

    return data;
  } catch (error) {
    if (isRedirectError(error)) throw error;

    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return null;
  }
}
