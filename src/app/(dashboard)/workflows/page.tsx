import Workflows from "@/app/(dashboard)/workflows/_components/workflows";
import { Suspense } from "react";
import WorkflowsSkeleton from "./_components/workflows-skeleton";
import CreateWorkflowDialog from "./_components/create-workflow-dialog";
import getWorkflows from "./_services/get-workkflows";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflows",
};

export default async function WorkflowsPage() {
  const workflows = await getWorkflows();
  const existingWorkflowNames = workflows?.map((workflow) => workflow.name);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog existingWorkflowNames={existingWorkflowNames} />
      </div>

      <div className="h-full">
        <Suspense fallback={<WorkflowsSkeleton />}>
          <Workflows workflows={workflows} />
        </Suspense>
      </div>
    </div>
  );
}
