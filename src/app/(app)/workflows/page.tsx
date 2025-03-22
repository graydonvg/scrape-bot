import { Suspense } from "react";
import WorkflowsSkeleton from "./_components/workflows-skeleton";
import CreateWorkflowDialog from "./_components/create-workflow-dialog";
import { Metadata } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";
import Workflows from "./_components/workflows";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "Workflows",
};

export default function WorkflowsPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Workflows" subtitle="Manage your workflows">
        <CreateWorkflowDialog />
      </PageHeader>

      <div className="relative flex size-full">
        <ScrollArea className="flex-1 rounded-xl border">
          <Suspense fallback={<WorkflowsSkeleton />}>
            <div className="p-4">
              <Workflows />
            </div>
          </Suspense>
        </ScrollArea>
      </div>
    </div>
  );
}
