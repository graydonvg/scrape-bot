import { WorkflowExecutionPhase } from "@/lib/types/execution";
import { TaskDb } from "@/lib/types/task";

export function groupTasksByPhaseNumber(
  uniquePhaseNumbers: number[],
  tasks: TaskDb[],
) {
  const groupedTasks = uniquePhaseNumbers.reduce((acc, phaseNumber) => {
    const tasksInPhase = tasks.filter((task) => task.phase === phaseNumber);

    acc.push({
      phaseNumber,
      tasks: tasksInPhase,
    });

    return acc;
  }, [] as WorkflowExecutionPhase[]);

  return groupedTasks;
}
