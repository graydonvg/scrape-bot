"use client";

import { Workflow } from "@/lib/types";
import { ReactFlowProvider } from "@xyflow/react";
import Flow from "./flow";
import TopBar from "../../_components/top-bar";

type Props = {
  workflow: Partial<Workflow>;
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
