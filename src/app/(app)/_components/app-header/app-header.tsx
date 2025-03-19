"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AvailableCredits from "./available-credits";

export default function AppHeader() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isExecutionPath = pathname.includes("/execution/");
  const isExecutionsPath = pathname.includes("/executions");
  const isEditorPath = pathname.includes("/editor");
  const workflowId = getWorkflowId();

  return (
    <header className="bg-sidebar z-50 flex h-12 shrink-0 items-center justify-between gap-4 px-4 py-2">
      {isMobile && <SidebarTrigger />}
      <div className="ml-auto flex items-center gap-4">
        {(isExecutionPath || isExecutionsPath) && (
          <Link href={`/workflows/workflow/editor/${workflowId}`}>
            <Button size="sm">
              <PencilIcon />
              Edit Workflow
            </Button>
          </Link>
        )}
        <AvailableCredits />
      </div>
    </header>
  );

  function getWorkflowId() {
    let workflowId = "";

    if (isExecutionsPath) workflowId = pathname.split("executions/")[1];
    if (isExecutionPath)
      workflowId = pathname.split("execution/")[1].split("/")[0];
    if (isEditorPath) workflowId = pathname.split("editor/")[1];

    return workflowId;
  }
}
