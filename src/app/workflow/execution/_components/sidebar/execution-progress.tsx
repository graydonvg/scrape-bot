"use client";

import useWorkflowsStore from "@/lib/store/workflows-store";
import { Separator } from "@/components/ui/separator";
import WorkflowGroup from "./groups/workflow-group";
import PhasesGroup from "./groups/phases-group";
import { calculateTotalCreditsConsumed } from "@/lib/utils";

export default function ExecutionProgress() {
  const { workflowExecutionData } = useWorkflowsStore();
  const executionPhases = workflowExecutionData?.executionPhases;
  const creditsConsumed = calculateTotalCreditsConsumed(executionPhases || []);

  return (
    <>
      <WorkflowGroup
        status={workflowExecutionData?.status}
        startedAt={workflowExecutionData?.startedAt}
        completedAt={workflowExecutionData?.completedAt}
        creditsConsumed={creditsConsumed}
      />
      <Separator />
      <PhasesGroup executionPhases={executionPhases} />
    </>
  );
}
