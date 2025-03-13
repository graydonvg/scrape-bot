import Workflows from "@/app/(dashboard)/workflows/_components/workflows";
import { Suspense } from "react";
import WorkflowsSkeleton from "./_components/workflows-skeleton";
import CreateWorkflowDialog from "./_components/create-workflow-dialog";
import { Metadata } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata: Metadata = {
  title: "Workflows",
};

export default function WorkflowsPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div className="mr-6 flex shrink-0 flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>

      <div className="relative size-full">
        <ScrollArea className="h-[calc(100vh-238.6px)] !rounded-xl border p-4 transition-[height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[calc(100vh-222.6px)]">
          <Suspense fallback={<WorkflowsSkeleton />}>
            <Workflows />
          </Suspense>
        </ScrollArea>
      </div>
    </div>
  );
}
