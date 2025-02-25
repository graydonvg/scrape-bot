import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WorkflowNode, WorkflowTaskType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

// export async function wait(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
