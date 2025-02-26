"use client";

import { Workflow } from "@/lib/types";
import WorkflowCard from "./workflow-card";
import useWorkflowsStore from "@/lib/store/workflows-store";
import { useEffect } from "react";

type Props = {
  workflows: Workflow[];
};

export default function WorklfowCards({ workflows }: Props) {
  const { updateExistingWorkflowNames } = useWorkflowsStore();

  useEffect(() => {
    updateExistingWorkflowNames(workflows);
  }, [workflows, updateExistingWorkflowNames]);

  return (
    <div className="space-y-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.workflowId} workflow={workflow} />
      ))}
    </div>
  );
}
