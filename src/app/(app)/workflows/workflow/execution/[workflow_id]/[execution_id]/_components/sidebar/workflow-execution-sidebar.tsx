import Phases from "./groups/phases/phases";
import { calculateTotalCreditsConsumed } from "@/lib/workflow/helpers/calculate-credit-consumption";
import { Separator } from "@/components/ui/separator";
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
    <div className="bg-sidebar fixed top-12 left-0 flex h-full max-h-[calc(100vh-48px)] w-[300px] max-w-[300px] min-w-[300px] flex-col border-r md:w-[368px] md:max-w-[368px] md:min-w-[368px] md:pl-12">
      <Workflow
        status={workflowExecutionData?.status}
        startedAt={workflowExecutionData?.startedAt}
        completedAt={workflowExecutionData?.completedAt}
        creditsConsumed={creditsConsumed}
      />
      <Separator />
      <Phases tasks={tasks} />
    </div>
  );
}
