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
  WorkflowTaskParamType,
} from "@/lib/types";
import { executorRegistry } from "../executors/executor-registry";
import getUniquePhaseNumbers from "./get-unique-phase-numbers";
import { groupTasksByPhaseNumber } from "./group-tasks";
import { taskRegistry } from "../tasks/task-registry";
import { Edge } from "@xyflow/react";

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
        .select("definition, tasks(*)")
        .eq("userId", userId)
        .eq("workflowExecutionId", executionId);

    if (selectExecutionDataError) {
      log.error(LOGGER_ERROR_MESSAGES.Select, {
        error: selectExecutionDataError,
      });
      throw new Error("Worklfow execution not found");
    }

    await initializeWorkflowExecution(
      supabase,
      userId,
      workflowId,
      executionId,
    );

    let creditsConsumed = 0;
    let executionFailed = false;
    const workflowDefinition = workflowExecutionData[0].definition;
    const edges = JSON.parse(workflowDefinition as string).edges as Edge[];
    const tasks = workflowExecutionData[0].tasks;
    const uniquePhaseNumbers = getUniquePhaseNumbers(tasks);
    const phases = groupTasksByPhaseNumber(uniquePhaseNumbers, tasks);
    // The phaseContext must be initialized here:

    // A:
    // To prevent losing the browser and page instances which we need in subsequent phases.
    // If the phaseContext is initialized in executeWorkflowPhase, the phaseContext
    // will get recreated for each phase, and the browser and page instances
    // set in phase 1 will be lost.

    // B:
    // So that we can perform a cleanup (close the browser once the execution completes)
    const phaseContext: ExecutionPhaseContext = { tasks: {} };

    for (const phase of phases) {
      await executeWorkflowPhase(supabase, phase, phaseContext, edges);
    }

    await finalizeWorkflowExecution(
      supabase,
      userId,
      workflowId,
      executionId,
      executionFailed,
      creditsConsumed,
    );

    await cleanupPhaseContext(phaseContext);

    revalidatePath("/workflow/execution");
  } catch (error) {
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
  phaseContext: ExecutionPhaseContext,
  edges: Edge[],
) {
  const startedAt = new Date().toISOString();
  const promises = [];

  for (const task of phase.tasks) {
    const node = JSON.parse(task.node as string) as WorkflowNode;
    populatePhaseContext(node, edges, phaseContext);

    const inputKeys = Object.keys(phaseContext.tasks[node.id].inputs);
    const inputs =
      inputKeys.length > 0
        ? // Using the inputs from phaseContext rather than directly from task,
          // because the phaseContext only includes inputs provided by the user
          // rather than inputs provided by the user AND source nodes.
          JSON.stringify(phaseContext.tasks[node.id].inputs)
        : // Prevent inserting empty objects into database
          null;

    const taskPromise = supabase
      .from("tasks")
      .update({
        status: "EXECUTING",
        startedAt,
        inputs,
      })
      .eq("taskId", task.taskId);

    promises.push(taskPromise);
  }

  const results = await Promise.allSettled(promises);

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
    log.error("Error at: executeWorkflowPhase", { errors });
  }

  const phaseResults = await executePhase(phase, phaseContext);

  await finalizePhase(supabase, phaseResults, phaseContext);
}

async function executePhase(
  phase: WorkflowExecutionPhase,
  phaseContext: ExecutionPhaseContext,
) {
  const phaseResults = [];
  const promises = [];

  for (const task of phase.tasks) {
    const node = JSON.parse(task.node as string) as WorkflowNode;
    const executorFn = executorRegistry[node.data.type];

    if (!executorFn) {
      phaseResults.push({
        taskId: task.taskId,
        nodeId: node.id,
        success: false,
        // TODO: Add message
      });
      continue; // Skip adding an invalid task to promises
    }

    const executionContext = createExecutionContext(node, phaseContext);

    // Wrap the promise to keep track of the taskId
    const promise = executorFn(task.taskId, node.id, executionContext)
      .then((result) => ({
        success: result.success,
        taskId: task.taskId,
        nodeId: node.id,
      }))
      .catch((error) => ({
        success: false,
        taskId: task.taskId,
        nodeId: node.id,
        error,
      }));

    promises.push(promise);
  }

  const promiseResults = await Promise.allSettled(promises);

  for (const result of promiseResults) {
    if (result.status === "fulfilled") {
      if (result.value.success) {
        phaseResults.push({
          taskId: result.value.taskId,
          nodeId: result.value.nodeId,
          success: true,
        });
      } else {
        phaseResults.push({
          taskId: result.value.taskId,
          nodeId: result.value.nodeId,
          success: false,
        });
      }
    }

    if (result.status === "rejected") {
      phaseResults.push({
        taskId: result.reason.taskId,
        nodeId: result.reason.nodeId,
        success: false,
      });
    }
  }

  return phaseResults;
}

async function finalizePhase(
  supabase: SupabaseClient<Database>,
  results: { taskId: string; nodeId: string; success: boolean }[],
  phaseContext: ExecutionPhaseContext,
) {
  const promises = results.map((result) => {
    const outputKeys = Object.keys(phaseContext.tasks[result.nodeId].outputs);
    const outputs =
      outputKeys.length > 0
        ? JSON.stringify(phaseContext.tasks[result.nodeId].outputs)
        : // Prevent inserting empty objects into database
          null;

    return supabase
      .from("tasks")
      .update({
        status: result.success ? "COMPLETED" : "FAILED",
        completedAt: new Date().toISOString(),
        outputs,
      })
      .eq("taskId", result.taskId);
  });

  const promiseResults = await Promise.allSettled(promises);

  const errors = [];

  for (const result of promiseResults) {
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
    log.error("Error at: finalizePhase", { errors });
  }
}

async function finalizeWorkflowExecution(
  supabase: SupabaseClient<Database>,
  userId: string,
  workflowId: string,
  executionId: string,
  executionFailed: boolean,
  creditsConsumed: number,
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

function populatePhaseContext(
  node: WorkflowNode,
  edges: Edge[],
  phaseContext: ExecutionPhaseContext,
) {
  phaseContext.tasks[node.id] = { inputs: {}, outputs: {} };

  const taskInputs = taskRegistry[node.data.type].inputs;

  for (const input of taskInputs) {
    // Inputs of type BrowserInstance will be handled by a different function
    if (input.type === WorkflowTaskParamType.BrowserInstance) continue;

    const inputValue = node.data.inputs[input.name];

    // Only include inputs provided by the user
    if (inputValue) {
      const task = phaseContext.tasks[node.id];

      task.inputs[input.name] = inputValue;
      continue;
    }

    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name,
    );

    if (!connectedEdge) {
      // This should not happen because the workflow has been validated
      log.error("Missing edge for input", { input, node });
      continue;
    }

    const outputValue =
      phaseContext.tasks[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ];

    phaseContext.tasks[node.id].inputs[input.name] = outputValue;
  }

  return phaseContext;
}

function createExecutionContext(
  node: WorkflowNode,
  phaseContext: ExecutionPhaseContext,
): ExecutionContext<WorkflowTask> {
  return {
    getInput: (name: WorkflowTaskParamName) =>
      phaseContext.tasks[node.id].inputs[name],

    setOutput: (name, value) => {
      phaseContext.tasks[node.id].outputs[name] = value;
    },

    setBrowser: (browser) => (phaseContext.browser = browser),
    getBrowser: () => phaseContext.browser,

    setPage: (page) => (phaseContext.page = page),
    getPage: () => phaseContext.page,
  };
}

async function cleanupPhaseContext(phaseContext: ExecutionPhaseContext) {
  if (phaseContext.browser) {
    try {
      await phaseContext.browser.close();
    } catch (error) {
      log.error("Failed to close browser", { error });
    }
  }
}
