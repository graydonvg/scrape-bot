"use client";

import { ReactFlowProvider } from "@xyflow/react";
import Workflow from "./workflow";

export default function WorkflowDemo() {
  return (
    <div className="shadow-primary/30 h-80 overflow-hidden rounded-xl border shadow-sm">
      <ReactFlowProvider>
        <Workflow />
      </ReactFlowProvider>
    </div>
  );
}
