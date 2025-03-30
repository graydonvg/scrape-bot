import "server-only";

import { LogCollector } from "@/lib/types/log";
import { Edge } from "@xyflow/react";
import { taskRegistry } from "../../tasks/task-registry";
import { Logger } from "next-axiom";
import { Task, TaskParamName, TaskParamType } from "@/lib/types/task";
import { ExecutionContext, ExecutionPhaseContext } from "@/lib/types/execution";
import { WorkflowNode } from "@/lib/types/workflow";

/*
 * Populates the execution phase context for a given workflow node by setting up its input values.
 *
 * For each expected input:
 * - If the input type is `BrowserInstance`, it is skipped because it's handled separately.
 * - If the node's data provides a user-defined value for the input, that value is used.
 * - Otherwise, the function looks for an edge connecting another node's output to this input:
 *   - If a connecting edge is found, the output from the source node is used as the input.
 *   - If no such edge is found (which should not happen in a validated workflow), an error is logged.
 */
export function populatePhaseContext(
  node: WorkflowNode,
  edges: Edge[],
  phaseContext: ExecutionPhaseContext,
  logCollector: LogCollector,
  log: Logger,
  taskId: string,
) {
  log = log.with({ function: "populatePhaseContext" });

  phaseContext.tasks[node.id] = { inputs: {}, outputs: {} };

  const taskInputs = taskRegistry[node.data.type].inputs;

  for (const input of taskInputs) {
    // Inputs of type BrowserInstance will be handled by a different function
    if (input.type === TaskParamType.BrowserInstance) continue;

    const inputValue = node.data.inputs[input.name];

    // Only include inputs provided by the user
    if (inputValue) {
      const task = phaseContext.tasks[node.id];

      task.inputs[input.name] = inputValue;
      continue;
    }

    // If no user provided input exists, get the input from
    // the souce node's output
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name,
    );

    if (!connectedEdge) {
      // This should not happen because the workflow has been validated
      logCollector.ERROR(taskId, "Missing connection for input");
      log.error("Missing edge for input", { input, node, edges });
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

/*
 * createExecutionContext creates an execution context for a given workflow node (task).
 *
 * This function returns an object with helper methods (getInput, setOutput, setBrowser, etc.)
 * that encapsulate the node-specific data and the shared phaseContext. These helper methods
 * are closures—they “capture” the values of `node` and `phaseContext` at the time of creation,
 * ensuring that they always refer to the correct state when called later.
 */
export function createExecutionContext(
  node: WorkflowNode,
  phaseContext: ExecutionPhaseContext,
  logCollector: LogCollector,
): ExecutionContext<Task> {
  return {
    getInput: (name: TaskParamName) => phaseContext.tasks[node.id].inputs[name],

    setOutput: (name, value) => {
      phaseContext.tasks[node.id].outputs[name] = value;
    },

    setBrowser: (browser) => (phaseContext.browser = browser),
    getBrowser: () => phaseContext.browser,

    setPage: (page) => (phaseContext.page = page),
    getPage: () => phaseContext.page,

    logDb: logCollector,
  };
}

export async function cleanupPhaseContext(
  phaseContext: ExecutionPhaseContext,
  log: Logger,
) {
  if (phaseContext.browser) {
    log = log.with({ function: "cleanupPhaseContext" });

    try {
      await phaseContext.browser.close();
    } catch (error) {
      log.error("Failed to close browser", { error });
    }
  }
}
