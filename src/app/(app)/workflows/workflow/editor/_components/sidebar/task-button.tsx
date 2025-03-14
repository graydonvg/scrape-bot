import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
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
    <Button
      draggable
      onDragStart={(e) => handleDragStart(e)}
      variant="ghost"
      className="flex h-fit w-full cursor-grab whitespace-normal select-none active:cursor-grabbing"
    >
      <div className="flex items-center gap-2 text-left">
        <task.icon size={16} />
        {task.label}
      </div>
      <GripVerticalIcon size={16} className="ml-auto" />
    </Button>
  );
}
