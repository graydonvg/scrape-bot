import { Edge, getIncomers } from "@xyflow/react";
import { WorkflowExecutionQueue, WorkflowNode } from "../../types";
import { taskRegistry } from "../task-registry";

type ExecutionQueue = {
  executionQueue?: WorkflowExecutionQueue[];
};

export default function buildExecutionQueue(
  nodes: WorkflowNode[],
  edges: Edge[],
): ExecutionQueue {
  // Find the entry point node.
  // This node is where execution begins.
  const entryPoint = nodes.find(
    (node) => taskRegistry[node.data.type].isEntryPoint,
  );

  if (!entryPoint) {
    throw new Error("No valid entry point found for workflow.");
  }

  // Set to track nodes that have been added to the execution queue.
  const nodesAddedToExecutionQueue = new Set<string>();

  // Queue to track nodes that are ready for execution in the current phase.
  const currentPhaseNodesQueue: WorkflowNode[] = [entryPoint];

  // Stores the execution phases, where each phase contains a list of nodes
  // that can be executed concurrently (they do not depend on each other).
  const executionQueue: WorkflowExecutionQueue[] = [];

  let phase = 1;

  // Process nodes in phases until no more nodes remain in the queue.
  while (currentPhaseNodesQueue.length > 0) {
    const currentPhaseNodes: WorkflowNode[] = []; // Nodes that will execute in this phase.
    const nextQueue: WorkflowNode[] = []; // Nodes that will be ready for the next phase.

    // Iterate over all nodes in the current execution queue.
    for (const node of currentPhaseNodesQueue) {
      // Skip nodes that have already been added to the execution queue.
      if (nodesAddedToExecutionQueue.has(node.id)) continue;

      // Check if the node has any invalid inputs (unresolved dependencies).
      const invalidInputs = getInvalidInputs(
        node,
        edges,
        nodesAddedToExecutionQueue,
      );

      if (invalidInputs.length > 0) {
        // If there are invalid inputs, the workflow is in an invalid state.
        console.error("Invalid inputs", node.id, invalidInputs);
        throw new Error(`Node ${node.id} has unresolved dependencies.`);
      }

      // Mark the node as scheduled for execution.
      nodesAddedToExecutionQueue.add(node.id);
      currentPhaseNodes.push(node);
    }

    // If there are nodes scheduled for execution in this phase, store them.
    if (currentPhaseNodes.length > 0) {
      executionQueue.push({ phase, nodes: currentPhaseNodes });
      phase++; // Move to the next phase.
    }

    // Find nodes that are now ready for execution in the next phase.
    for (const node of nodes) {
      // If the node is already added to the execution queue, skip it.
      if (nodesAddedToExecutionQueue.has(node.id)) continue;

      // Get the incoming connections (dependencies) for the node.
      const incomers = getIncomers(node, nodes, edges);

      // If all incoming nodes have already been added to the execution queue, this node is now ready.
      if (
        incomers.every((incomer) => nodesAddedToExecutionQueue.has(incomer.id))
      ) {
        nextQueue.push(node);
      }
    }

    // Replace the current queue with the nodes that will be executed in the next phase.
    currentPhaseNodesQueue.length = 0;
    currentPhaseNodesQueue.push(...nextQueue);
  }

  // Return the full execution queue with all phases.
  return { executionQueue };
}

function getInvalidInputs(
  node: WorkflowNode,
  edges: Edge[],
  nodesAddedToExecutionQueue: Set<string>,
) {
  const invalidInputs: string[] = [];
  const inputs = taskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    if (inputValue?.length > 0) continue; // Skip if the input is already provided by the user

    // Get all incoming edges for this node
    const incomingEdges = edges.filter((edge) => edge.target === node.id);

    // Find an edge that provides a value for this input
    const connectedEdge = incomingEdges.find(
      (edge) => edge.targetHandle === input.name,
    );

    // Check if the required input is already added to the execution queue
    const isProvidedByQueuedNode =
      connectedEdge && nodesAddedToExecutionQueue.has(connectedEdge.source);

    if (input.required) {
      // If the input is required but has no valid source, mark it as invalid
      if (!isProvidedByQueuedNode) invalidInputs.push(input.name);
    } else {
      // If the input is optional, check if it's linked to a node
      // that is not yet added to the execution queue.
      if (
        connectedEdge &&
        !nodesAddedToExecutionQueue.has(connectedEdge.source)
      ) {
        invalidInputs.push(input.name);
      }
    }
  }

  return invalidInputs;
}
