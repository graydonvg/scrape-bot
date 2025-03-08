import { WorkflowTaskDb } from "@/lib/types/workflow";

export default function getUniquePhaseNumbers(tasks: WorkflowTaskDb[]) {
  const phasesNumbers = tasks?.map((task) => task.phase);
  const phaseNumbersSet = new Set(phasesNumbers);
  const uniquePhaseNumbers = Array.from(phaseNumbersSet);

  return uniquePhaseNumbers;
}
