import { InboxIcon } from "lucide-react";
import CreateWorkflowDialog from "./create-workflow-dialog";
import WorkflowCard from "./workflow-card";
import CustomAlert from "@/components/custom-alert";
import getWorkflows from "../_services/get-workkflows";
import WorkflowsStoreUpdater from "@/components/store-updaters/workflows-store-updater";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Workflows() {
  const workflows = await getWorkflows();

  if (!workflows) {
    return (
      <CustomAlert
        title="Error"
        description="Something went wrong. Please try again later."
      />
    );
  }

  if (!workflows.length) {
    return (
      <div className="flex-center h-full flex-col gap-4">
        <div className="bg-accent flex-center size-20 rounded-full">
          <InboxIcon className="stroke-primary size-10 dark:stroke-blue-500" />
        </div>

        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflow created yet</p>
          <p className="text-muted-foreground text-sm">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorkflowDialog triggerLabel="Create your first workflow" />
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[calc(100svh-238.6px)] rounded-md border p-4 transition-[height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[calc(100svh-222.6px)]">
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.workflowId} workflow={workflow} />
          ))}
        </div>
      </ScrollArea>
      <div
        id="scroll-area-measurement-element"
        className="pointer-events-none invisible absolute inset-0 -z-50 size-full select-none"
      />
      <WorkflowsStoreUpdater workflows={workflows} />
    </>
  );
}
