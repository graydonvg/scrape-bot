import { clsx, type ClassValue } from "clsx";
import { intervalToDuration } from "date-fns";
import { twMerge } from "tailwind-merge";
import { WorkflowExecutionPlan } from "./types/execution";
import { WorkflowNode } from "./types/workflow";
import { taskRegistry } from "./workflow/tasks/task-registry";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringToDate(dateString?: string | null) {
  return dateString ? new Date(dateString) : null;
}

export function datesToDurationString(start?: Date | null, end?: Date | null) {
  if (!start || !end) return null;

  const elapsed = end.getTime() - start.getTime();

  if (elapsed < 1000) {
    return `${elapsed}ms`;
  }

  const duration = intervalToDuration({
    start: 0,
    end: elapsed,
  });

  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
}

export function calculateTotalCreditCostFromNodes(nodes: WorkflowNode[]) {
  const totalCreditCost = nodes.reduce(
    (acc, node) => acc + taskRegistry[node.data.type].credits,
    0,
  );

  return totalCreditCost;
}

export function calculateTotalCreditCostFromExecutionPlan(
  executionPlan: WorkflowExecutionPlan[],
) {
  const nodes = executionPlan.flatMap((plan) => plan.nodes);
  const totalCreditCost = calculateTotalCreditCostFromNodes(nodes);

  return totalCreditCost;
}

export function getFormattedWorkflowExecutionStatus(status: string) {
  return status.split("_").join(" ");
}

// export async function wait(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
