"use client";

import { ReactFlowProvider } from "@xyflow/react";
import Flow from "./flow";
import { WorkflowDb } from "@/lib/types/workflow";
import WorkflowEditorSidebar from "./sidebar/workflow-editor-sidebar";

type Props = {
  workflow: Partial<WorkflowDb>;
};

export default function Editor({ workflow }: Props) {
  return (
    <div className="bg-sidebar fixed inset-0 top-12 flex">
      {/* <TopBar
        workflowId={workflow.workflowId!}
        title="Workflow editor"
        subtitle={workflow.name!}
      /> */}
      <ReactFlowProvider>
        <WorkflowEditorSidebar workflowId={workflow.workflowId!} />
        <Flow workflow={workflow} />
      </ReactFlowProvider>
    </div>
  );
}
