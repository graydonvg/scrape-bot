"use client";

import { useState } from "react";
import ExecuteWorkflowButton from "../../editor/_components/buttons/execute-workflow-button";
import SaveWorkflowButton from "../../editor/_components/buttons/save-workflow-button";

type Props = {
  workflowId: string;
};

export default function ActionButtons({ workflowId }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex justify-end gap-4">
      <SaveWorkflowButton
        workflowId={workflowId}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <ExecuteWorkflowButton
        workflowId={workflowId}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}
