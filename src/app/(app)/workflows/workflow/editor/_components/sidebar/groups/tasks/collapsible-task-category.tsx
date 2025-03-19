import { ChevronRight, LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import TaskButton from "./task-button";
import { TaskType } from "@/lib/types/task";

type Props = {
  category: string;
  icon: LucideIcon;
  isOpen: boolean;
  taskTypes: TaskType[];
  onOpenChange: () => void;
};

export default function CollapsibleTaskCategory({
  category,
  icon,
  isOpen,
  taskTypes,
  onOpenChange,
}: Props) {
  const Icon = icon;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="group/collapsible"
      asChild
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={category}>
            <Icon />
            <span className="truncate">{category}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {taskTypes.map((taskType, index) => (
              <SidebarMenuSubItem key={index}>
                <TaskButton taskType={taskType} />
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
