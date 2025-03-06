"use client";

import { WorkflowDb } from "@/lib/types";
import { ReactFlowProvider } from "@xyflow/react";
import Flow from "./flow";
import TopBar from "../../_components/top-bar";

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
