"use client";

import { WorkflowDb } from "@/lib/types";
import WorkflowCard from "./workflow-card";
import useWorkflowsStore from "@/lib/store/workflows-store";
import { useEffect } from "react";

type Props = {
  workflows: WorkflowDb[];
};

export default function WorklfowCards({ workflows }: Props) {
  const { setExistingWorkflowNames } = useWorkflowsStore();

  useEffect(() => {
    setExistingWorkflowNames(workflows.map((workflow) => workflow.name));
  }, [workflows, setExistingWorkflowNames]);

  return (
    <div className="space-y-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.workflowId} workflow={workflow} />
      ))}
    </div>
  );
}
