import { InboxIcon } from "lucide-react";
import CreateWorkflowDialog from "./create-workflow-dialog";
import CustomAlert from "@/components/custom-alert";
import getWorkflows from "../_data-access/get-workkflows";
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
      <div className="flex-center absolute-center h-full flex-col gap-4">
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

  return <WorklfowCards workflows={workflows} />;
}
