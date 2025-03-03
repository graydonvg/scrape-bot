import { clsx, type ClassValue } from "clsx";
import { intervalToDuration } from "date-fns";
import { twMerge } from "tailwind-merge";
import { WorkflowExecutionPhase } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function calculateTotalCreditsConsumed(
  phase: Pick<WorkflowExecutionPhase, "creditsConsumed">[],
) {
  return phase.reduce((acc, phase) => acc + (phase?.creditsConsumed || 0), 0);
}

// export async function wait(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
