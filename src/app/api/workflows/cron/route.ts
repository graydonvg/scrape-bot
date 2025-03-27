import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import createSupabaseService from "@/lib/supabase/supabase-service";
import { AxiomRequest, Logger, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";
import arcjet, { shield, detectBot } from "@/lib/arcjet";

const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    }),
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
  );
// .withRule(
//   fixedWindow({
//     mode: "LIVE",
//     window: "60s",
//     max: 10,
//   }),
// );

export const GET = withAxiom(async (request: AxiomRequest) => {
  const log = request.log;

  try {
    const decision = await aj.protect(request);

    for (const { reason } of decision.results) {
      if (reason.isError()) {
        log.error("Arcjet error", { message: reason.message });
        return NextResponse.json(userErrorMessages.Unexpected, { status: 500 });
      }
    }

    if (decision.isDenied()) {
      if (decision.reason.isShield()) {
        return NextResponse.json(
          { error: "You are suspicious!" },
          { status: 403 },
        );
      }

      if (decision.reason.isBot()) {
        return NextResponse.json({ error: "Forbidden!" }, { status: 403 });
      }

      // if (decision.reason.isRateLimit()) {
      //   return NextResponse.json(
      //     { error: "Too Many Requests" },
      //     { status: 429 },
      //   );
      // }
    }

    const supabaseService = createSupabaseService();

    const { data: workflows, error } = await supabaseService
      .from("workflows")
      .select("workflowId")
      .not("cron", "is", null)
      .eq("status", "PUBLISHED")
      .lte("nextExecutionAt", new Date().toISOString());

    if (error) {
      log.error(loggerErrorMessages.Select, {
        error,
      });
      return NextResponse.json(userErrorMessages.Unexpected, { status: 500 });
    }

    for (const workflow of workflows) {
      triggerWorkflow(workflow.workflowId, log);
    }

    return NextResponse.json({ workflowsToRun: workflows }, { status: 200 });
  } catch (error) {
    log.error(loggerErrorMessages.Unexpected, { error });

    return NextResponse.json(userErrorMessages.Unexpected, { status: 500 });
  }
});

function triggerWorkflow(workflowId: string, log: Logger) {
  const triggerApiUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/workflows/execute?workflowId=${workflowId}`;

  fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET}`,
    },
    cache: "no-store",
  }).catch((error) =>
    log.error("Error triggering workflow", {
      workflowId,
      triggerApiUrl,
      error,
    }),
  );
}
