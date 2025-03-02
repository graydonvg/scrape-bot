import { Edge, getIncomers } from "@xyflow/react";
import {
  WorkflowExecutionPlan,
  WorkflowNode,
  WorkflowExecutionPlanError,
  WorkflowExecutionPlanErrorType,
  WorkflowNodeInvalidInputs,
} from "../../types";
import { taskRegistry } from "../task-registry";

type ExecutionPlan = {
  executionPlan?: WorkflowExecutionPlan[];
  error?: WorkflowExecutionPlanError;
};

export default function buildWorkflowExecutionPlan(
  nodes: WorkflowNode[],
  edges: Edge[],
): ExecutionPlan {
  // Find the entry point node.
  // This node is where execution begins.
  const entryPoint = nodes.find(
    (node) => taskRegistry[node.data.type].isEntryPoint,
  );

  if (!entryPoint) {
    return {
      error: {
        type: WorkflowExecutionPlanErrorType.NO_ENTRY_POINT,
      },
    };
  }

  // Array of inputs that fail validation
  const invalidInputsCollection: WorkflowNodeInvalidInputs[] = [];

  // Set to track nodes that have been added to the execution plan.
  const planned = new Set<string>();

  // Stores the execution plan in phases, where each phase contains a list of nodes
  // that can be executed concurrently (they do not depend on each other).
  const executionPlan: WorkflowExecutionPlan[] = [];

  // Maximum number of phases = number of nodes (i.e. each phase contains one node)
  // Stop the loop early if all nodes have been added to the execution plan
  // before the maximum number of phases is reached (i.e. some phases contain more than one node)
  for (
    let phase = 1;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const currentPhase: WorkflowExecutionPlan = { phase, nodes: [] };

    for (const node of nodes) {
      if (planned.has(node.id)) {
        // Skip nodes that have already been added to the execution plan.
        continue;
      }

      // Check if the node has any invalid inputs (values provided by the user or source nodes).
      const invalidInputs = getInvalidInputs(node, edges, planned);

      if (invalidInputs.length > 0) {
        // Get the nodes, if any, that are connected to the given node as the source of an edge.
        const incomers = getIncomers(node, nodes, edges);

        if (incomers.every((incomer) => planned.has(incomer.id))) {
          // If ALL source nodes are planned (added to the executionPlan), and there are still errors,
          // then the current node has an invalid input.
          // If a source node is planned, it has been validated.
          // This means the error comes from the current node.
          invalidInputsCollection.push({
            nodeId: node.id,
            inputNames: invalidInputs,
          });
        } else {
          // If ANY of the source nodes are NOT yet planned (added to the executionPlan),
          // skip this node for now.
          // The source nodes that have not yet been planned may have valid inputs to provide.
          // This node will be revisited in an upcomming iteration
          // since it won't be added to the executionPlan yet.
          continue;
        }
      }

      // At this point the node is valid and can be added to the current phase
      currentPhase.nodes.push(node);
    }

    // At this point all nodes in the current phase have been validated
    // and can be added to the execution plan
    executionPlan.push(currentPhase);

    for (const node of currentPhase.nodes) {
      // Mark all nodes in the current phase as planned
      planned.add(node.id);
    }
  }

  if (invalidInputsCollection.length > 0) {
    return {
      error: {
        type: WorkflowExecutionPlanErrorType.INVALID_INPUTS,
        invalidInputs: invalidInputsCollection,
      },
    };
  }

  return { executionPlan };
}

function getInvalidInputs(
  node: WorkflowNode,
  edges: Edge[],
  planned: Set<string>,
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

    if (input.required && connectedEdge && planned.has(connectedEdge.source)) {
      // If the input is required and there is a connected edge and the connected edge's source node
      // is planned (added to the executionPlan), the we can continue
      // If a node is planned, it has been validated.
      continue;
    }

    if (!input.required) {
      if (!connectedEdge) {
        // If there is no connected edge, and the input is not required, we can continue
        continue;
      }

      if (connectedEdge && planned.has(connectedEdge.source)) {
        // If the input is not required, but there is a connected edge and the connected edge's source node
        // is planned (added to the executionPlan), we can continue
        // If a node is planned, it has been validated.
        continue;
      }
    }

    // At this point the input has failed all checks and is marked as invalid
    invalidInputs.push(input.name);
  }

  return invalidInputs;
}
