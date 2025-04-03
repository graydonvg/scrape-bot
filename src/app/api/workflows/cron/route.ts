import { siteConfig } from "@/config/site";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import createSupabaseService from "@/lib/supabase/supabase-service";
import { AxiomRequest, Logger, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";

export const GET = withAxiom(async (request: AxiomRequest) => {
  try {
    const log = request.log;
    const now = new Date().toISOString();
    const supabaseService = createSupabaseService();

    const { data: workflows, error } = await supabaseService
      .from("workflows")
      .select("workflowId")
      .not("cron", "is", null)
      .eq("status", "PUBLISHED")
      .lte("nextExecutionAt", now);

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
    request.log?.error(loggerErrorMessages.Unexpected, { error });

    return NextResponse.json(userErrorMessages.Unexpected, { status: 500 });
  }
});

function triggerWorkflow(workflowId: string, log: Logger) {
  const triggerApiUrl = `${siteConfig.siteUrl}/api/workflows/execute?workflowId=${workflowId}`;

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
