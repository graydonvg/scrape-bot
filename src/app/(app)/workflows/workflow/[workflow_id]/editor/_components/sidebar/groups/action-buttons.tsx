"use client";

import { useState } from "react";
import ExecuteWorkflowButton from "../../buttons/execute-workflow-button";
import SaveWorkflowButton from "../../buttons/save-workflow-button";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";

type Props = {
  workflowId: string;
};

export default function ActionButtons({ workflowId }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SidebarGroup className="p-4">
      <SidebarGroupContent className="flex flex-col gap-2">
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
