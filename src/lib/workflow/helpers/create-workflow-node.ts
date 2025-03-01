import { WorkflowNode, WorkflowTaskType } from "@/lib/types";

export function createWorkflowNode(
  taskType: WorkflowTaskType,
  position?: { x: number; y: number },
): WorkflowNode {
  return {
    id: crypto.randomUUID(),
    type: "node",
    dragHandle: ".drag-handle",
    position: { x: 0, y: 0, ...position },
    data: { type: taskType, inputs: {} },
  };
}
