"use client";

import useWorkflowsStore from "@/lib/store/workflows-store";
import { Separator } from "@/components/ui/separator";
import Workflow from "./groups/workflow/workflow";
import Phases from "./groups/phases/phases";
import { calculateTotalCreditsConsumed } from "@/lib/utils";

export default function ExecutionDetails() {
  const { workflowExecutionData } = useWorkflowsStore();
  const tasks = workflowExecutionData?.tasks;
  const creditsConsumed = calculateTotalCreditsConsumed(tasks || []);

  return (
    <>
      <Workflow
        status={workflowExecutionData?.status}
        startedAt={workflowExecutionData?.startedAt}
        completedAt={workflowExecutionData?.completedAt}
        creditsConsumed={creditsConsumed}
      />
      <Separator />
      <Phases tasks={tasks} />
    </>
  );
}
