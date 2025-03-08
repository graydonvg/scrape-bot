import { WorkflowExecutionPhase } from "@/lib/types/execution";
import { WorkflowTaskDb } from "@/lib/types/workflow";

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
  }, [] as WorkflowExecutionPhase[]);

  return groupedTasks;
}
