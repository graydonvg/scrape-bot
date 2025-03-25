"use client";

import { useState } from "react";
import ExecuteWorkflowButton from "../../buttons/execute-workflow-button";
import SaveWorkflowButton from "../../buttons/save-workflow-button";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import PublishWorkflowButton from "../../buttons/publish-workflow-button";
import UnpublishWorkflowButton from "../../buttons/unpublish-workflow-button";

type Props = {
  workflowId: string;
  isPublished?: boolean;
};

export default function ActionButtons({
  workflowId,
  isPublished = false,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SidebarGroup className="p-4">
      <SidebarGroupContent className="flex flex-col gap-2">
        {isPublished && (
          <UnpublishWorkflowButton
            workflowId={workflowId}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
        {!isPublished && (
          <>
            <SaveWorkflowButton
              workflowId={workflowId}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
            <PublishWorkflowButton
              workflowId={workflowId}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </>
        )}
        <ExecuteWorkflowButton
          workflowId={workflowId}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
