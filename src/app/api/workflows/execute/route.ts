import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { timingSafeEqual } from "crypto";
import { AxiomRequest, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { WorkflowExecutionPlan } from "@/lib/types/execution";
import { WorkflowNode } from "@/lib/types/workflow";
import { TaskDb } from "@/lib/types/task";
import { taskRegistry } from "@/lib/workflow/tasks/task-registry";
import executeWorkflow from "@/lib/workflow/helpers/execute-workflow/execute-workflow";
import createSupabaseService from "@/lib/supabase/supabase-service";
import { CronExpressionParser } from "cron-parser";
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

    const headersList = await headers();
    const authHeader = headersList.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      log.warn(loggerErrorMessages.Unauthorized);
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const secret = authHeader.split(" ")[1];

    if (!isValidSecret(secret)) {
      log.warn(loggerErrorMessages.Unauthorized);
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const workflowId = searchParams.get("workflowId");

    if (!workflowId) {
      log.error("Workflow ID is missing");
      return NextResponse.json("Bad request", { status: 400 });
    }

    const supabaseService = createSupabaseService();

    const { data, error } = await supabaseService
      .from("workflows")
      .select("*")
      .eq("workflowId", workflowId);

    if (error) {
      log.error(loggerErrorMessages.Select, {
        error,
      });

      return NextResponse.json(userErrorMessages.Unexpected, { status: 500 });
    }

    const workflow = data[0];

    const executionPlan = JSON.parse(
      workflow.executionPlan as string,
    ) as WorkflowExecutionPlan[];

    if (!executionPlan) {
      log.error("Execution plan is missing");
      return NextResponse.json(userErrorMessages.Unexpected, { status: 500 });
    }

    if (!workflow.cron) {
      log.error("Workflow cron is missing");
      return NextResponse.json(userErrorMessages.Unexpected, { status: 500 });
    }

    const parsedCron = CronExpressionParser.parse(workflow.cron, {
      tz: "UTC",
    });

    const nextExecutionAt = parsedCron.next().toDate().toISOString();

    const { data: workflowExecutionData, error: insertWorkflowExecutionError } =
      await supabaseService
        .from("workflowExecutions")
        .insert({
          workflowId,
          userId: workflow.userId,
          status: "PENDING",
          trigger: "CRON",
          startedAt: new Date().toISOString(),
          definition: workflow.definition,
        })
        .select("workflowExecutionId");

    if (insertWorkflowExecutionError) {
      log.error(loggerErrorMessages.Insert, {
        error: insertWorkflowExecutionError,
      });
      return NextResponse.json(userErrorMessages.Unexpected, { status: 500 });
    }

    const workflowExecutionId = workflowExecutionData[0].workflowExecutionId;

    const tasksToInsert = executionPlan.flatMap((plan) => {
      return plan.nodes.flatMap((node: WorkflowNode) => {
        return {
          workflowExecutionId,
          userId: workflow.userId,
          status: "CREATED",
          phase: plan.phase,
          node: JSON.stringify(node),
          name: taskRegistry[node.data.type].label,
        } as TaskDb;
      });
    });

    const { error: insertTaskError } = await supabaseService
      .from("tasks")
      .insert(tasksToInsert);

    if (insertTaskError) {
      log.error(loggerErrorMessages.Insert, {
        error: insertTaskError,
      });
      return NextResponse.json(userErrorMessages.Unexpected, { status: 500 });
    }

    await executeWorkflow(
      supabaseService,
      workflow.userId,
      workflowId,
      workflowExecutionId,
      nextExecutionAt,
    );

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    log.error(loggerErrorMessages.Unexpected, { error });

    return NextResponse.json(userErrorMessages.Unexpected, { status: 500 });
  }
});

function isValidSecret(secret: string) {
  const API_SECRET = process.env.API_SECRET;

  if (!API_SECRET) return false;

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
}
