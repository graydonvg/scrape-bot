import { SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import CollapsiblePhaseTrigger from "./collapsible-phase-trigger";
import PhaseTaskButton from "./phase-task-button";
import { TaskDb } from "@/lib/types/task";

type Props = {
  phaseNumber: number;
  tasks?: TaskDb[];
  isOpen: boolean;
  onOpenChange: () => void;
  onCollapsibleTriggerClick: () => void;
};

export default function CollapsiblePhase({
  phaseNumber,
  tasks,
  isOpen,
  onOpenChange,
  onCollapsibleTriggerClick,
}: Props) {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="group/collapsible"
      asChild
    >
      <SidebarMenuItem>
        <CollapsiblePhaseTrigger
          phaseNumber={phaseNumber}
          tasks={tasks}
          onClick={onCollapsibleTriggerClick}
        />
        <CollapsibleContent>
          <SidebarMenuSub>
            {tasks?.map((task, index) => (
              <PhaseTaskButton key={index} task={task} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
