import { Separator } from "@/components/ui/separator";
import ActionButtons from "./groups/action-buttons";
import TaskMenu from "./groups/tasks/task-menu";
import Workflow from "./groups/workflow/workflow";
import getWorkflow from "../../_data-access/get-workflow";

type Props = {
  workflow: Awaited<ReturnType<typeof getWorkflow>>;
};

export default function WorkflowEditorSidebar({ workflow }: Props) {
  return (
    <div className="bg-sidebar flex h-full w-[320px] max-w-[320px] min-w-[320px] flex-col border-r">
      <Workflow workflow={workflow} />
      <Separator />
      <TaskMenu />
      <Separator />
      <ActionButtons workflowId={workflow!.workflowId} />
    </div>
  );
}
