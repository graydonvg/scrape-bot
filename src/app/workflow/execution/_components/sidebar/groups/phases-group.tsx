import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight, ListOrdered, Loader2Icon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { WorkflowExecutionPhase } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  executionPhases?: WorkflowExecutionPhase[];
};

export default function PhasesGroup({ executionPhases }: Props) {
  const phasesNumbers = executionPhases?.map(
    (executionPhase) => executionPhase.phase,
  );
  const phaseNumbersSet = new Set(phasesNumbers);
  const uniquePhaseNumbers = Array.from(phaseNumbersSet);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground flex-center gap-2 text-base">
        <ListOrdered size={20} className="stroke-muted-foreground/80" />
        <span className="font-semibold">Phases</span>
      </SidebarGroupLabel>
      <SidebarMenu>
        {uniquePhaseNumbers.length > 0 ? (
          uniquePhaseNumbers.map((phaseNumber) => {
            const phaseTasks = executionPhases?.filter(
              (executionPhase) => executionPhase.phase === phaseNumber,
            );

            return (
              <Collapsible
                key={phaseNumber}
                defaultOpen={true}
                className="group/collapsible"
                asChild
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={`Phase: ${phaseNumber}`}>
                      <Loader2Icon
                        size={20}
                        className="stroke-muted-foreground"
                      />
                      <span className="truncate">{`Phase: ${phaseNumber}`}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {phaseTasks?.map((task, index) => (
                        <SidebarMenuSubItem key={index}>
                          <SidebarMenuSubButton>
                            <Loader2Icon
                              size={20}
                              className="stroke-muted-foreground"
                            />
                            <div className="flex w-full items-center justify-between">
                              <span className="truncate font-semibold">
                                {task.taskName}
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {task.status}
                              </span>
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })
        ) : (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="bg-muted h-6 w-full" />
            ))}
          </div>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
