"use client";

import { ReactFlowProvider } from "@xyflow/react";
import Flow from "./flow";
import WorkflowEditorSidebar from "./sidebar/workflow-editor-sidebar";
import getWorkflow from "../_data-access/get-workflow";

type Props = {
  workflow: Awaited<ReturnType<typeof getWorkflow>>;
};

export default function Editor({ workflow }: Props) {
  return (
    <div className="bg-sidebar flex flex-1">
      <ReactFlowProvider>
        <WorkflowEditorSidebar workflow={workflow} />
        <Flow workflow={workflow} />
      </ReactFlowProvider>
    </div>
  );
}
