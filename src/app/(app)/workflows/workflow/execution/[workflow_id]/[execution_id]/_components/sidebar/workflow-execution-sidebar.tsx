import useWorkflowsStore from "@/lib/store/workflows-store";
import Workflow from "./groups/workflow/workflow";
import Phases from "./groups/phases/phases";
import { calculateTotalCreditsConsumed } from "@/lib/workflow/helpers/calculate-credit-consumption";

export default function WorkflowExecutionSidebar() {
  const { workflowExecutionData } = useWorkflowsStore();
  const tasks = workflowExecutionData?.tasks;
  const creditsConsumed = calculateTotalCreditsConsumed(tasks || []);

  return (
    <div className="bg-sidebar fixed top-12 left-0 flex h-full w-[300px] max-w-[300px] min-w-[300px] flex-col border-r p-4 pl-4 md:w-[348px] md:max-w-[348px] md:min-w-[348px] md:pl-16">
      <Workflow
        status={workflowExecutionData?.status}
        startedAt={workflowExecutionData?.startedAt}
        completedAt={workflowExecutionData?.completedAt}
        creditsConsumed={creditsConsumed}
      />
      <Phases tasks={tasks} />
    </div>
  );
}
