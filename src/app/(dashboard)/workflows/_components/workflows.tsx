import { InboxIcon } from "lucide-react";
import CreateWorkflowDialog from "./create-workflow-dialog";
import CustomAlert from "@/components/custom-alert";
import getWorkflows from "../_data-access/get-workkflows";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorklfowCards from "./worklfow-cards";

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
    <ScrollArea className="h-[calc(100svh-238.6px)] rounded-md border p-4 transition-[height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[calc(100svh-222.6px)]">
      <WorklfowCards workflows={workflows} />
    </ScrollArea>
  );
}
