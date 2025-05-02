import "server-only";

import { loggerErrorMessages } from "@/lib/constants";
import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { Logger } from "next-axiom";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { stringToDate } from "@/lib/utils";
import { Period } from "@/lib/types/analytics";

export default async function getPeriods() {
  let log = new Logger().with({ context: "getPeriods" });

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

    const { data, error } = await supabase
      .from("workflowExecutions")
      .select("startedAt")
      .eq("userId", user.id)
      .order("startedAt", { ascending: true })
      .limit(1);

    if (error) {
      log.error(loggerErrorMessages.Select, {
        error,
      });
      return null;
    }

    const currentYear = new Date().getFullYear();
    let minYears = currentYear;

    if (data.length > 0) {
      const earliestExecutionYear =
        stringToDate(data[0].startedAt)?.getFullYear() ?? currentYear;
      minYears = earliestExecutionYear;
    }

    const periods: Period[] = [];

    for (let year = minYears; year <= currentYear; year++) {
      for (let month = 0; month <= 11; month++) {
        periods.push({ year, month });
      }
    }

    return periods;
  } catch (error) {
    // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
    // Throw the “error” to trigger the redirection
    if (isRedirectError(error)) throw error;

    log.error(loggerErrorMessages.Unexpected, { error });
    return null;
  }
}
