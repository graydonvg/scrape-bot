import { SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { WorkflowTaskDb } from "@/lib/types";
import CollapsiblePhaseTrigger from "./collapsible-phase-trigger";
import PhaseTaskButton from "./phase-task-button";

type Props = {
  phaseNumber: number;
  tasks?: WorkflowTaskDb[];
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
