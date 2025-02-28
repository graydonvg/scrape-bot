"use client";

import { WorkflowNode } from "@/lib/types";
import workflowToExecutionQueue from "@/lib/workflow/workflow-to-execution-queue";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

export default function useWorkflowExecutionQueue() {
  const { toObject } = useReactFlow();

  const generateExecutionQueue = useCallback(() => {
    const { nodes, edges } = toObject();

    const { executionQueue } = workflowToExecutionQueue(
      nodes as WorkflowNode[],
      edges,
    );

    return executionQueue;
  }, [toObject]);

  return generateExecutionQueue;
}
