import Phases from "./groups/phases/phases";
import { calculateTotalCreditsConsumed } from "@/lib/workflow/helpers/calculate-credit-consumption";
import Workflow from "./groups/workflow";
import getWorkflowExecutionWithTasksClient from "../../_data-access/get-execution-with-tasks-client";

type Props = {
  workflowExecutionData: Awaited<
    ReturnType<typeof getWorkflowExecutionWithTasksClient>
  >;
};

export default function WorkflowExecutionSidebar({
  workflowExecutionData,
}: Props) {
  const tasks = workflowExecutionData?.tasks;
  const creditsConsumed = calculateTotalCreditsConsumed(tasks || []);

  return (
    <div
      id="execution-details-sidebar"
      className="bg-sidebar flex h-full w-[320px] max-w-[320px] min-w-[320px] flex-col divide-y border-r"
    >
      <Workflow
        workflowExecutionData={workflowExecutionData}
        creditsConsumed={creditsConsumed}
      />
      <Phases tasks={tasks} />
    </div>
  );
}
