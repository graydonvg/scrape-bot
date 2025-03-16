// import { ChevronRight, LucideIcon } from "lucide-react";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import TaskButton from "./task-button";
// import { TaskType } from "@/lib/types/task";

// type Props = {
//   category: string;
//   icon: LucideIcon;
//   isOpen: boolean;
//   taskTypes: TaskType[];
//   onOpenChange: () => void;
// };

// export default function CollapsibleCategory({
//   category,
//   icon,
//   isOpen,
//   taskTypes,
//   onOpenChange,
// }: Props) {
//   const Icon = icon;

//   return (
//     <Collapsible
//       open={isOpen}
//       onOpenChange={onOpenChange}
//       className="group/collapsible space-y-1"
//     >
//       <CollapsibleTrigger className="flex w-full items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Icon size={14} className="stroke-muted-foreground" />
//           <span className="text-sm">{category}</span>
//         </div>
//         <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//       </CollapsibleTrigger>
//       <CollapsibleContent className="ml-2 border-l pl-2">
//         {taskTypes.map((taskType, index) => (
//           <TaskButton key={index} taskType={taskType} />
//         ))}
//       </CollapsibleContent>
//     </Collapsible>
//   );
// }

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

export default function CollapsibleCategory({
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
