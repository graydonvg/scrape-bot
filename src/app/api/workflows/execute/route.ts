import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { timingSafeEqual } from "crypto";
import { AxiomRequest, Logger, withAxiom } from "next-axiom";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { WorkflowExecutionPlan } from "@/lib/types/execution";
import { WorkflowNode } from "@/lib/types/workflow";
import { TaskDb } from "@/lib/types/task";
import { taskRegistry } from "@/lib/workflow/tasks/task-registry";
import executeWorkflow from "@/lib/workflow/helpers/execute-workflow/execute-workflow";
import createSupabaseService from "@/lib/supabase/supabase-service";
import { CronExpressionParser } from "cron-parser";
import { calculateTotalCreditCostFromExecutionPlan } from "@/lib/utils";

export const POST = withAxiom(async (request: AxiomRequest) => {
  try {
    const log = request.log;
    const headersList = await headers();
    const authHeader = headersList.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      log.warn(loggerErrorMessages.Unauthorized);
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const secret = authHeader.split(" ")[1];

    if (!isValidSecret(secret, log)) {
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

    const totalCreditsRequired =
      calculateTotalCreditCostFromExecutionPlan(executionPlan);

    // A stored procedure that retrieves the current available credits for the user.
    // It checks if the user has enough credits to deduct the specified amount.
    // If not, it returns false.
    // If the user has enough credits, it deducts the amount from availableCredits and
    // adds it to reservedCredits.
    // The function returns true if the operation is successful.
    // If the entire process is successful, the user's credit balance will be finalized.
    // If a server error occurs, the user will be refunded.
    const { data: reserveCreditsSuccess, error: reserveCreditsError } =
      await supabaseService.rpc("reserve_credits_for_workflow_execution", {
        p_user_id: workflow.userId,
        p_amount: totalCreditsRequired,
      });

    if (reserveCreditsError) {
      log.error(loggerErrorMessages.Update, {
        error: reserveCreditsError,
      });
      return NextResponse.json(userErrorMessages.Unexpected, { status: 500 });
    }

    if (!reserveCreditsSuccess) {
      // If the user has insufficient credits, disable the workflow's schedule
      // to prevent it from being executed in future cron jobs.
      const { error } = await supabaseService
        .from("workflows")
        .update({
          cron: null,
          nextExecutionAt: null,
        })
        .eq("userId", workflow.userId)
        .eq("workflowId", workflowId);

      if (error) {
        log.error(loggerErrorMessages.Update, {
          error,
        });
      }

      return NextResponse.json(userErrorMessages.InsufficientCredits, {
        status: 400,
      });
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
    request.log?.error(loggerErrorMessages.Unexpected, { error });

    return NextResponse.json(userErrorMessages.Unexpected, { status: 500 });
  }
});

function isValidSecret(secret: string, log: Logger) {
  const API_SECRET = process.env.API_SECRET;

  if (!API_SECRET) return false;

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch (error) {
    log.error("Error validating secret", { error });
    return false;
  }
}
