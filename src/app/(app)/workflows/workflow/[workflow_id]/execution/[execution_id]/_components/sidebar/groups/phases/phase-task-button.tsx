import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CircleCheckBigIcon, CircleXIcon, Loader2Icon } from "lucide-react";
import { TaskDb } from "@/lib/types/task";
import useWorkflowsStore from "@/lib/store/workflows-store";

type Props = {
  task: TaskDb;
};

export default function PhaseTaskButton({ task }: Props) {
  const { isMobile, setOpenMobile } = useSidebar();
  const { selectedTaskId, setSelectedTaskId } = useWorkflowsStore();
  const state = getTaskState();

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        aria-disabled={state.isLoading}
        isActive={selectedTaskId === task.taskId}
        onClick={handleClick}
        className="h-fit cursor-pointer p-2"
      >
        {state.isLoading && (
          <Loader2Icon
            size={20}
            className="stroke-muted-foreground animate-spin"
          />
        )}
        {state.isCompleted && (
          <CircleCheckBigIcon
            size={20}
            className="stroke-success dark:stroke-green-500"
          />
        )}
        {state.isFailed && (
          <CircleXIcon size={20} className="stroke-destructive" />
        )}
        <span className="font-semibold !whitespace-normal">{task.name}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );

  function getTaskState() {
    const isLoading = task.status !== "COMPLETED" && task.status !== "FAILED";
    const isCompleted = task.status === "COMPLETED";
    const isFailed = task.status === "FAILED";

    return {
      isLoading,
      isCompleted,
      isFailed,
    };
  }

  function handleClick() {
    if (task.status === "EXECUTING") return;

    setSelectedTaskId(task.taskId);

    if (isMobile) setOpenMobile(false);
  }
}
