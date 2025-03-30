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
      className="bg-sidebar flex h-[calc(100vh-(--spacing(12)))] w-[320px] max-w-[320px] min-w-[320px] flex-1 flex-col divide-y overflow-y-auto border-r"
      style={{
        scrollbarWidth: "thin",
      }}
    >
      <Workflow
        workflowExecutionData={workflowExecutionData}
        creditsConsumed={creditsConsumed}
      />
      <Phases tasks={tasks} />
    </div>
  );
}
