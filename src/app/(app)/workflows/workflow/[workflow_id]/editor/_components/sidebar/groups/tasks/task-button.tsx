import { SidebarMenuSubButton, useSidebar } from "@/components/ui/sidebar";
import { TaskType } from "@/lib/types/task";
import { taskRegistry } from "@/lib/workflow/tasks/task-registry";
import { GripVerticalIcon } from "lucide-react";
import { DragEvent } from "react";

type Props = {
  taskType: TaskType;
};

export default function TaskButton({ taskType }: Props) {
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
      className="flex h-fit cursor-grab items-center justify-between p-2 select-none active:cursor-grabbing"
    >
      <button
        draggable
        onDragStart={(e) => handleDragStart(e)}
        className="w-full space-x-4"
      >
        <div className="flex items-center gap-2 text-left">
          <div className="shrink-0">
            <task.icon size={16} />
          </div>
          {task.label}
        </div>
        <GripVerticalIcon size={16} />
      </button>
    </SidebarMenuSubButton>
  );
}
