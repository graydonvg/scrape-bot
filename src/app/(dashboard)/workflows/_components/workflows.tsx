import getWorkflowsAction from "@/app/(dashboard)/workflows/_actions/get-workflows-action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Inbox } from "lucide-react";
import CreateWorkflowDialog from "./create-workflow-dialog";

export default async function Workflows() {
  const workflows = await getWorkflowsAction();

  if (!workflows) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
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
          <Inbox className="stroke-primary size-10" />
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

  return <div></div>;
}

// try {

// 	const workflows = await getWorkflowsAction();
// 	return <div></div>;
// } catch (error) {
// 	return (
// 		<Alert variant="destructive">
// 			<AlertCircle className="size-4" />
// 			<AlertTitle>Error</AlertTitle>
// 			<AlertDescription>
// 				Something went wrong. Please try again later.
// 			</AlertDescription>
// 		</Alert>
// 	);
// }
