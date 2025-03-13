import { SidebarMenuSubButton, useSidebar } from "@/components/ui/sidebar";
import { TaskType } from "@/lib/types/task";
import { taskRegistry } from "@/lib/workflow/tasks/task-registry";
import { GripVerticalIcon } from "lucide-react";
import { DragEvent } from "react";

type Props = {
  taskType: TaskType;
};

export default function TaskMenuButton({ taskType }: Props) {
  const task = taskRegistry[taskType];
  const { isMobile, setOpenMobile } = useSidebar();

  function handleDragStart(e: DragEvent) {
    e.dataTransfer.setData("application/reactflow", taskType);
    e.dataTransfer.effectAllowed = "move";

    if (isMobile) setOpenMobile(false);
  }

  return (
    <SidebarMenuSubButton
      asChild
      className="flex cursor-grab items-center justify-between select-none active:cursor-grabbing"
    >
      <button
        draggable
        onDragStart={(e) => handleDragStart(e)}
        className="w-full space-x-4"
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="shrink-0">
            <task.icon size={16} />
          </div>
          <span className="truncate">{task.label}</span>
        </div>
        <GripVerticalIcon size={16} />
      </button>
    </SidebarMenuSubButton>
  );
}
