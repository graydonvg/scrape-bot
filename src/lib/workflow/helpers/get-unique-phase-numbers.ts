import { TaskDb } from "@/lib/types/task";

export default function getUniquePhaseNumbers(tasks: TaskDb[]) {
  const phasesNumbers = tasks?.map((task) => task.phase);
  const phaseNumbersSet = new Set(phasesNumbers);
  const uniquePhaseNumbers = Array.from(phaseNumbersSet);

  return uniquePhaseNumbers;
}
