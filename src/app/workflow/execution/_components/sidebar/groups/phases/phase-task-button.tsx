import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { CircleCheckBigIcon, CircleXIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { WorkflowTaskDb } from "@/lib/types";

type Props = {
  task: WorkflowTaskDb;
};

export default function PhaseTaskButton({ task }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("task");
  const state = getTaskState();

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        isActive={taskId === task.taskId}
        onClick={() => {
          if (task.status === "EXECUTING") return;

          router.push(`?task=${task.taskId}`);
        }}
        className="cursor-pointer"
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
        <div className="flex w-full items-center justify-between">
          <span className="truncate font-semibold">{task.name}</span>
          <span
            className={cn("text-muted-foreground text-xs", {
              "text-success dark:text-green-500": state.isCompleted,
              "text-destructive": state.isFailed,
            })}
          >
            {task.status}
          </span>
        </div>
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
}
