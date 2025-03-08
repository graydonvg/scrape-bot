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
import TaskMenuButton from "./task-menu-button";
import { WorkflowTaskType } from "@/lib/types/workflow";

type Props = {
  category: string;
  icon: LucideIcon;
  isOpen: boolean;
  taskTypes: WorkflowTaskType[];
  onOpenChange: () => void;
  onCollapsibleTriggerClick: () => void;
};

export default function CollapsibleCategory({
  category,
  icon,
  isOpen,
  taskTypes,
  onOpenChange,
  onCollapsibleTriggerClick,
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
        <CollapsibleTrigger onClick={onCollapsibleTriggerClick} asChild>
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
                <TaskMenuButton taskType={taskType} />
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
