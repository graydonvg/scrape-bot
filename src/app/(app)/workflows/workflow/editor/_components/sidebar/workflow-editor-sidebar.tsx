import ActionButtons from "./action-buttons";
import TaskMenu from "./task-menu";

type Props = {
  workflowId: string;
};

export default function WorkflowEditorSidebar({ workflowId }: Props) {
  return (
    <div className="bg-sidebar flex h-full w-[300px] max-w-[300px] min-w-[300px] flex-col border-r p-4 md:ml-12">
      <TaskMenu />
      <ActionButtons workflowId={workflowId} />
    </div>
  );
}
