import { TaskDb } from "@/lib/types/task";

export function calculateTotalCreditsConsumed(
  tasks: Pick<TaskDb, "creditsConsumed">[],
) {
  return tasks.reduce((acc, task) => acc + (task?.creditsConsumed || 0), 0);
}
