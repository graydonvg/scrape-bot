import ActionButtons from "./groups/action-buttons";
import TaskMenu from "./groups/tasks/task-menu";
import Workflow from "./groups/workflow/workflow";
import getWorkflow from "../../_data-access/get-workflow";

type Props = {
  workflow: Awaited<ReturnType<typeof getWorkflow>>;
};

export default function WorkflowEditorSidebar({ workflow }: Props) {
  return (
    <div
      className="bg-sidebar flex h-[calc(100vh-(--spacing(12)))] w-[320px] max-w-[320px] min-w-[320px] flex-1 flex-col divide-y overflow-y-auto border-r"
      style={{
        scrollbarWidth: "thin",
      }}
    >
      <Workflow workflow={workflow} />
      <TaskMenu />
      <ActionButtons
        workflowId={workflow!.workflowId}
        isPublished={workflow?.status === "PUBLISHED"}
      />
    </div>
  );
}
