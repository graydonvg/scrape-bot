"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AvailableCredits from "./available-credits";
// import { Separator } from "@/components/ui/separator";
// import BreadcrumbHeader from "@/components/breadcrumb-header";

export default function AppHeader() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isExecutionPath = pathname.includes("/execution/");
  const isExecutionsPath = pathname.includes("/executions");
  const workflowId = getWorkflowId();

  return (
    <header className="bg-sidebar z-50 flex h-12 shrink-0 items-center justify-between gap-4 border-b px-4 py-2">
      <div className="flex h-full items-center gap-2">
        {isMobile && (
          <div className="flex h-full items-center gap-2">
            <SidebarTrigger />
            {/* <Separator orientation="vertical" className="mr-2 h-full" /> */}
          </div>
        )}
        {/* <BreadcrumbHeader /> */}
      </div>
      <div className="ml-auto flex items-center gap-4">
        {(isExecutionPath || isExecutionsPath) && (
          <Link href={`/workflows/workflow/${workflowId}/editor`}>
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

    if (isExecutionsPath || isExecutionPath)
      workflowId = pathname.split("/")[3];

    return workflowId;
  }
}
