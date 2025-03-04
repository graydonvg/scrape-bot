import { clsx, type ClassValue } from "clsx";
import { intervalToDuration } from "date-fns";
import { twMerge } from "tailwind-merge";
import { WorkflowPhase, WorkflowTaskDb } from "./types";

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
  tasks: Pick<WorkflowTaskDb, "creditsConsumed">[],
) {
  return tasks.reduce((acc, task) => acc + (task?.creditsConsumed || 0), 0);
}

export function getUniquePhaseNumbers(tasks: WorkflowTaskDb[]) {
  const phasesNumbers = tasks?.map((task) => task.phase);
  const phaseNumbersSet = new Set(phasesNumbers);
  const uniquePhaseNumbers = Array.from(phaseNumbersSet);

  return uniquePhaseNumbers;
}

export function groupTasksByPhaseNumber(
  uniquePhaseNumbers: number[],
  tasks: WorkflowTaskDb[],
) {
  const groupedTasks = uniquePhaseNumbers.reduce((acc, phaseNumber) => {
    const tasksInPhase = tasks.filter((task) => task.phase === phaseNumber);

    acc.push({
      phaseNumber,
      tasks: tasksInPhase,
    });

    return acc;
  }, [] as WorkflowPhase[]);

  return groupedTasks;
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
