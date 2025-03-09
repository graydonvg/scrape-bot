import { TaskType } from "@/lib/types/task";
import { WorkflowNode } from "@/lib/types/workflow";

export default function createWorkflowNode(
  taskType: TaskType,
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
