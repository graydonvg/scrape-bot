"use client";

import useWorkflowsStore from "@/lib/store/workflows-store";
import { Separator } from "@/components/ui/separator";
import WorkflowGroup from "./groups/workflow-group";
import PhaseGroup from "./groups/phase-group";
import { calculateTotalCreditsConsumed } from "@/lib/utils";

export default function ExecutionProgress() {
  const { workflowExecutionData } = useWorkflowsStore();
  const tasks = workflowExecutionData?.tasks;
  const creditsConsumed = calculateTotalCreditsConsumed(tasks || []);

  return (
    <>
      <WorkflowGroup
        status={workflowExecutionData?.status}
        startedAt={workflowExecutionData?.startedAt}
        completedAt={workflowExecutionData?.completedAt}
        creditsConsumed={creditsConsumed}
      />
      <Separator />
      <PhaseGroup tasks={tasks} />
    </>
  );
}
