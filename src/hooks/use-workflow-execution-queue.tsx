"use client";

import { WorkflowNode } from "@/lib/types";
import buildExecutionQueue from "@/lib/workflow/helpers/build-execution-queue";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

export default function useWorkflowExecutionQueue() {
  const { toObject } = useReactFlow();

  const generateExecutionQueue = useCallback(() => {
    const { nodes, edges } = toObject();

    const { executionQueue } = buildExecutionQueue(
      nodes as WorkflowNode[],
      edges,
    );

    return executionQueue;
  }, [toObject]);

  return generateExecutionQueue;
}
