"use client";

import useWorkflowsStore from "@/lib/store/workflows-store";
import { Workflow } from "@/lib/types";
import { useEffect } from "react";

type Props = {
  workflows: Workflow[];
};

export default function WorkflowsStoreUpdater({ workflows }: Props) {
  const { updateExistingWorkflowNames } = useWorkflowsStore();

  useEffect(() => {
    updateExistingWorkflowNames(workflows);
  }, [workflows, updateExistingWorkflowNames]);

  return null;
}

// We need the existing workflow names to immidiately display an error message when creating a workflow with a duplicate name (name must be unique).

// Since no client component receives the full array of workflows, we update the store here.
