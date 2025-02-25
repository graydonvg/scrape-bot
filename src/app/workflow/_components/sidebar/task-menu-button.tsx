import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import { WorkflowTaskType } from "@/lib/types";
import { taskRegistry } from "@/lib/workflow/task-registry";
import { GripVerticalIcon } from "lucide-react";
import { DragEvent } from "react";

type Props = {
  taskType: WorkflowTaskType;
};

export default function TaskMenuButton({ taskType }: Props) {
  const task = taskRegistry[taskType];

  function handleDragStart(e: DragEvent) {
    e.dataTransfer.setData("application/reactflow", taskType);
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <SidebarMenuSubButton
      asChild
      className="flex cursor-grab items-center justify-between select-none active:cursor-grabbing"
    >
      <button
        draggable
        onDragStart={(e) => handleDragStart(e)}
        className="w-full"
      >
        <div className="flex items-center gap-2">
          <task.icon size={16} />
          <span className="truncate">{task.label}</span>
        </div>
        <GripVerticalIcon size={16} />
      </button>
    </SidebarMenuSubButton>
  );
}
