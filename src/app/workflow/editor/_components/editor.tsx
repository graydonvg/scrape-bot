"use client";

import { ReactFlowProvider } from "@xyflow/react";
import Flow from "./flow";
import TopBar from "../../_components/top-bar";
import { WorkflowDb } from "@/lib/types/workflow";

type Props = {
  workflow: Partial<WorkflowDb>;
};

export default function Editor({ workflow }: Props) {
  return (
    <ReactFlowProvider>
      <TopBar
        workflowId={workflow.workflowId!}
        title="Workflow editor"
        subtitle={workflow.name!}
      />
      <section className="flex grow">
        <Flow workflow={workflow} />
      </section>
    </ReactFlowProvider>
  );
}
