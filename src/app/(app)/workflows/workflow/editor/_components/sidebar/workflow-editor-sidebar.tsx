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
    <div className="bg-sidebar flex h-full w-[300px] max-w-[300px] min-w-[300px] flex-col border-r md:ml-12 md:w-[320px] md:max-w-[320px] md:min-w-[320px]">
      <Workflow workflow={workflow} />
      <Separator />
      <TaskMenu />
      <Separator />
      <ActionButtons workflowId={workflow!.workflowId} />
    </div>
  );
}
