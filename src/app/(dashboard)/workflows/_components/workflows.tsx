import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, InboxIcon } from "lucide-react";
import CreateWorkflowDialog from "./create-workflow-dialog";
import getWorkflows from "../_services/get-workkflows";
import WorkflowCard from "./workflow-card";

export default async function Workflows() {
  const workflows = await getWorkflows();

  if (!workflows) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later.
        </AlertDescription>
      </Alert>
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
    <div className="flex flex-col gap-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}
