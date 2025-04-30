import "server-only";

import { loggerErrorMessages } from "@/lib/constants";
import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { Logger } from "next-axiom";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { periodToDateRange } from "@/lib/utils";
import { Period } from "@/lib/types/analytics";
import { eachDayOfInterval, format } from "date-fns";

type Stats = {
  [key: string]: {
    success: number;
    failed: number;
    partiallyFailed: number;
  };
};

export default async function getWorkflowExecutionStats(
  selectedPeriod: Period,
) {
  let log = new Logger();
  log = log.with({ context: "getWorkflowExecutionStats" });

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
      .select("startedAt, status")
      .eq("userId", user.id)
      .in("status", ["COMPLETED", "FAILED", "PARTIALLY_FAILED"])
      .gte("startedAt", dateRange.startDate)
      .lte("startedAt", dateRange.endDate);

    if (error) {
      log.error(loggerErrorMessages.Select, {
        error,
      });
      return null;
    }

    const dateFormat = "yyyy-MM-dd";

    const stats = eachDayOfInterval({
      start: dateRange.startDate,
      end: dateRange.endDate,
    })
      .map((date) => format(date, dateFormat))
      .reduce((acc, date) => {
        acc[date] = {
          success: 0,
          failed: 0,
          partiallyFailed: 0,
        };

        return acc;
      }, {} as Stats);

    workflowExecutions.forEach((execution) => {
      const date = format(execution.startedAt, dateFormat);

      if (execution.status === "COMPLETED") {
        stats[date].success += 1;
      }

      if (execution.status === "FAILED") {
        stats[date].failed += 1;
      }

      if (execution.status === "PARTIALLY_FAILED") {
        stats[date].partiallyFailed += 1;
      }
    });

    const result = Object.entries(stats).map(([date, infos]) => ({
      date,
      ...infos,
    }));

    return result;
  } catch (error) {
    // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
    // Throw the “error” to trigger the redirection
    if (isRedirectError(error)) throw error;

    log.error(loggerErrorMessages.Unexpected, { error });
    return null;
  }
}
