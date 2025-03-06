import "server-only";

import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { Logger } from "next-axiom";
import { revalidatePath } from "next/cache";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";
import {
  ExecutionContext,
  ExecutionPhaseContext,
  WorkflowNode,
  WorkflowExecutionPhase,
  WorkflowTask,
  WorkflowTaskParamName,
} from "@/lib/types";
import { executorRegistry } from "../executors/executor-registry";
import getUniquePhaseNumbers from "./get-unique-phase-numbers";
import { groupTasksByPhaseNumber } from "./group-tasks";
import { taskRegistry } from "../tasks/task-registry";

// TODO: Add  error handling

let log = new Logger();

export default async function executeWorkflow(
  userId: string,
  workflowId: string,
  executionId: string,
) {
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
    );

    let creditsConsumed = 0;
    let executionFailed = false;
    const uniquePhaseNumbers = getUniquePhaseNumbers(tasks);
    const phases = groupTasksByPhaseNumber(uniquePhaseNumbers, tasks);

    for (const phase of phases) {
      await executeWorkflowPhase(supabase, phase);
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

async function executeWorkflowPhase(
  supabase: SupabaseClient<Database>,
  phase: WorkflowExecutionPhase,
) {
  const startedAt = new Date().toISOString();
  const taskIds = phase.tasks.map((task) => task.taskId);

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

  const phaseResults = await executePhase(phase);

  await finalizePhase(supabase, phaseResults);
}

async function executePhase(phase: WorkflowExecutionPhase) {
  const phaseResults = [];
  const promises = [];

  for (const task of phase.tasks) {
    const node = JSON.parse(task.node as string) as WorkflowNode;
    const executorFn = executorRegistry[node.data.type];

    if (!executorFn) {
      phaseResults.push({
        taskId: task.taskId,
        success: false,
      });
      continue; // Skip adding an invalid task to promises
    }

    const phaseContext = initializePhaseContext(task.taskId, node);
    const executionContext = createExecutionContext(task.taskId, phaseContext);

    // Wrap the promise to keep track of the taskId
    const promise = executorFn(task.taskId, executionContext)
      .then((result) => ({ success: result.success, taskId: task.taskId }))
      .catch((error) => ({ success: false, taskId: task.taskId, error }));

    promises.push(promise);
  }

  const promiseResults = await Promise.allSettled(promises);

  for (const result of promiseResults) {
    if (result.status === "fulfilled") {
      if (result.value.success) {
        phaseResults.push({
          taskId: result.value.taskId,
          success: true,
        });
      } else {
        phaseResults.push({
          taskId: result.value.taskId,
          success: false,
        });
      }
    }

    if (result.status === "rejected") {
      phaseResults.push({
        taskId: result.reason.taskId,
        success: false,
      });
    }
  }

  return phaseResults;
}

async function finalizePhase(
  supabase: SupabaseClient<Database>,
  results: { taskId: string; success: boolean }[],
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

function initializePhaseContext(taskId: string, node: WorkflowNode) {
  const phaseContext: ExecutionPhaseContext = { tasks: {} };

  phaseContext.tasks[taskId] = { inputs: {}, outputs: {} };

  const taskInputs = taskRegistry[node.data.type].inputs;

  for (const input of taskInputs) {
    const inputValue = node.data.inputs[input.name];

    if (inputValue) {
      const task = phaseContext.tasks[taskId];

      task.inputs[input.name] = inputValue;
    }
  }

  return phaseContext;
}

function createExecutionContext(
  taskId: string,
  phaseContext: ExecutionPhaseContext,
): ExecutionContext<WorkflowTask> {
  return {
    getInput: (name: WorkflowTaskParamName) =>
      phaseContext.tasks[taskId].inputs[name],
  };
}
