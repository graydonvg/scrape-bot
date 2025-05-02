import "server-only";

import { loggerErrorMessages } from "@/lib/constants";
import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { Logger } from "next-axiom";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { periodToDateRange } from "@/lib/utils";
import { Period } from "@/lib/types/analytics";

export default async function getStatsCardsValues(selectedPeriod: Period) {
  let log = new Logger().with({ context: "getStatsCardsValues" });

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

    const dateRange = periodToDateRange(selectedPeriod);

    const { data: workflowExecutions, error } = await supabase
      .from("workflowExecutions")
      .select("startedAt, creditsConsumed, tasks!inner(creditsConsumed)")
      .eq("userId", user.id)
      .in("status", ["COMPLETED", "FAILED", "PARTIALLY_FAILED"])
      .not("tasks.creditsConsumed", "is", null)
      // .neq("tasks.creditsConsumed", 0)
      .gte("startedAt", dateRange.startDate)
      .lte("startedAt", dateRange.endDate);

    if (error) {
      log.error(loggerErrorMessages.Select, {
        error,
      });
      return null;
    }

    const stats = {
      workflowExecutions: workflowExecutions.length,
      creditsConsumed: 0,
      taskExecutions: 0,
    };

    stats.creditsConsumed = workflowExecutions.reduce((acc, execution) => {
      return acc + (execution.creditsConsumed ?? 0);
    }, 0);

    stats.taskExecutions = workflowExecutions.reduce((acc, execution) => {
      return acc + execution.tasks.length;
    }, 0);

    return stats;
  } catch (error) {
    // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
    // Throw the “error” to trigger the redirection
    if (isRedirectError(error)) throw error;

    log.error(loggerErrorMessages.Unexpected, { error });
    return null;
  }
}
