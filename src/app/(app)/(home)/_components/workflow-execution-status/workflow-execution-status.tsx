import { Period } from "@/lib/types/analytics";
import getWorkflowExecutionStats from "../../_data-access/get-workflow-execution-stats";
import WorkflowExecutionStatusChart from "./workflow-execution-status-chart";

type Props = {
  selectedPeriod: Period;
};

export default async function WorkflowExecutionStatus({
  selectedPeriod,
}: Props) {
  const data = await getWorkflowExecutionStats(selectedPeriod);

  return <WorkflowExecutionStatusChart data={data} />;
}
