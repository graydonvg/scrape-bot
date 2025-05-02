import { clsx, type ClassValue } from "clsx";
import { endOfMonth, intervalToDuration, startOfMonth } from "date-fns";
import { twMerge } from "tailwind-merge";
import { WorkflowExecutionPlan } from "./types/execution";
import { WorkflowNode } from "./types/workflow";
import { taskRegistry } from "./workflow/tasks/task-registry";
import { Period } from "./types/analytics";
import { UserDb } from "./types/user";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = "ZAR") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
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

export function periodToDateRange(period: Period) {
  const startDate = startOfMonth(
    new Date(period.year, period.month),
  ).toISOString();
  const endDate = endOfMonth(new Date(period.year, period.month)).toISOString();

  return { startDate, endDate };
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

export function getUserFullName(user: UserDb) {
  const userFullName = `${user.firstName ? user.firstName : ""} ${user.lastName ? user.lastName : ""}`;

  return userFullName.trim();
}

export function getUsername(user: UserDb) {
  const userFullName = getUserFullName(user);
  return userFullName.length ? userFullName : user.email.split("@")[0];
}

export function getUserAvatarFallbackChars(user: UserDb) {
  const userFullName = getUserFullName(user);

  return userFullName.length
    ? userFullName
        .split(" ")
        .slice(0, 2)
        .map((name) => name.charAt(0))
        .join("")
    : user.email.charAt(0);
}

// export async function wait(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
