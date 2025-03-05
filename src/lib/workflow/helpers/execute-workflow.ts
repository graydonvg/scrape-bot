import "server-only";

import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { Logger } from "next-axiom";
import { revalidatePath } from "next/cache";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";
import {
  getUniquePhaseNumbers,
  groupTasksByPhaseNumber,
  wait,
} from "@/lib/utils";
import { WorkflowNode, WorkflowPhase } from "@/lib/types";
import { taskRegistry } from "../task-registry";

// TODO: Add  error handling

export default async function executeWorkflow(
  userId: string,
  workflowId: string,
  executionId: string,
) {
  let log = new Logger();
  log = log.with({
    context: "executeWorkflow",
    userId,
    workflowId,
    executionId,
  });

  try {
    const supabase = await createSupabaseServerClient();

    const { data: workflowExecutionData, error: selectExecutionDataError } =
      await supabase
        .from("workflowExecutions")
        .select("tasks(*)")
        .eq("userId", userId)
        .eq("workflowExecutionId", executionId);

    if (selectExecutionDataError) {
      log.error(LOGGER_ERROR_MESSAGES.Select, {
        error: selectExecutionDataError,
      });
      throw new Error("Worklfow execution not found");
    }

    const tasks = workflowExecutionData[0].tasks;

    await initializeWorkflowExecution(
      supabase,
      userId,
      workflowId,
      executionId,
      log,
    );

    let creditsConsumed = 0;
    let executionFailed = false;
    const uniquePhaseNumbers = getUniquePhaseNumbers(tasks);
    const tasksPerPhase = groupTasksByPhaseNumber(uniquePhaseNumbers, tasks);

    for (const phase of tasksPerPhase) {
      // await wait(3000);
      // TODO: consume credits
      await executeWorkflowPhase(supabase, phase, log);
    }

    await finalizeWorkflowExecution(
      supabase,
      userId,
      workflowId,
      executionId,
      executionFailed,
      creditsConsumed,
      log,
    );

    revalidatePath("/workflow/execution");
  } catch (error) {
    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    throw error;
  }
}

async function initializeWorkflowExecution(
  supabase: SupabaseClient<Database>,
  userId: string,
  workflowId: string,
  executionId: string,
  log: Logger,
) {
  const workflowExecutionsPromise = supabase
    .from("workflowExecutions")
    .update({ startedAt: new Date().toISOString(), status: "EXECUTING" })
    .eq("userId", userId)
    .eq("workflowExecutionId", executionId);

  const workflowsPromise = supabase
    .from("workflows")
    .update({
      lastExecutionId: executionId,
      lastExecutedAt: new Date().toISOString(),
      lastExecutionStatus: "EXECUTING",
    })
    .eq("userId", userId)
    .eq("workflowId", workflowId);

  const tasksPromise = supabase
    .from("tasks")
    .update({
      status: "PENDING",
    })
    .eq("userId", userId)
    .eq("workflowExecutionId", executionId);

  const results = await Promise.allSettled([
    workflowExecutionsPromise,
    workflowsPromise,
    tasksPromise,
  ]);

  const errors = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      if (result.value.error) {
        errors.push(result.value.error);
      }
    }

    if (result.status === "rejected") {
      errors.push(result.reason);
    }
  }

  if (errors.length > 0) {
    // TODO: Handle errors
    log.error("Error at: initializeWorkflowExecution", { errors });
  }
}

async function finalizeWorkflowExecution(
  supabase: SupabaseClient<Database>,
  userId: string,
  workflowId: string,
  executionId: string,
  executionFailed: boolean,
  creditsConsumed: number,
  log: Logger,
) {
  const workflowExecutionsPromise = supabase
    .from("workflowExecutions")
    .update({
      status: executionFailed ? "FAILED" : "COMPLETED",
      completedAt: new Date().toISOString(),
      creditsConsumed,
    })
    .eq("userId", userId)
    .eq("workflowExecutionId", executionId);

  const workflowsPromise = supabase
    .from("workflows")
    .update({
      lastExecutionStatus: executionFailed ? "FAILED" : "COMPLETED",
    })
    .eq("userId", userId)
    .eq("workflowId", workflowId)
    .eq("lastExecutionId", executionId);

  const results = await Promise.allSettled([
    workflowExecutionsPromise,
    workflowsPromise,
  ]);

  const errors = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      if (result.value.error) {
        errors.push(result.value.error);
      }
    }

    if (result.status === "rejected") {
      errors.push(result.reason);
    }
  }

  if (errors.length > 0) {
    // TODO: Handle errors
    log.error("Error at: finalizeWorkflowExecution", { errors });
  }
}

async function executeWorkflowPhase(
  supabase: SupabaseClient<Database>,
  phase: WorkflowPhase,
  log: Logger,
) {
  const startedAt = new Date().toISOString();
  const taskIds = phase.tasks.map((task) => task.taskId);
  const nodes: WorkflowNode[] = phase.tasks.map((task) =>
    JSON.parse(task.node as string),
  );

  const { error } = await supabase
    .from("tasks")
    .update({
      status: "EXECUTING",
      startedAt,
    })
    .in("taskId", taskIds);

  if (error) {
    // TODO: Handle error
    log.error("Error at: executeWorkflowPhase", { error });
  }

  let taskNumber = 1;
  for (const node of nodes) {
    const creditsRequired = taskRegistry[node.data.type].credits;

    console.log(`Task: ${taskNumber}. Credits: ${creditsRequired}`);

    taskNumber++;
  }

  const results = [];
  for (const task of phase.tasks) {
    await wait(2000);
    const success = Math.random() < 0.7;

    results.push({
      taskId: task.taskId,
      success,
    });
  }

  await finalizePhase(supabase, results, log);
}

async function finalizePhase(
  supabase: SupabaseClient<Database>,
  results: { taskId: string; success: boolean }[],
  log: Logger,
) {
  const promises = results.map((result) =>
    supabase
      .from("tasks")
      .update({
        status: result.success ? "COMPLETED" : "FAILED",
        completedAt: new Date().toISOString(),
      })
      .eq("taskId", result.taskId),
  );

  const promiseResults = await Promise.allSettled(promises);

  log.info("Final results", promiseResults);
}
