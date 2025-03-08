import { WorkflowTaskDb } from "@/lib/types/workflow";

export function calculateTotalCreditsConsumed(
  tasks: Pick<WorkflowTaskDb, "creditsConsumed">[],
) {
  return tasks.reduce((acc, task) => acc + (task?.creditsConsumed || 0), 0);
}
