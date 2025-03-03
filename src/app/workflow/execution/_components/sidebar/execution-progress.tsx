"use client";

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
import useWorkflowsStore from "@/lib/store/workflows-store";
import {
  CalendarIcon,
  ChevronRight,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  ListOrdered,
  Loader2Icon,
  WorkflowIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ExecutionProgressMenuItem from "./execution-progress-menu-item";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function ExecutionProgress() {
  const { workflowExecutionData } = useWorkflowsStore();
  const executionPhases = workflowExecutionData?.executionPhases;
  const phasesNumbers = workflowExecutionData?.executionPhases.map(
    (executionPhase) => executionPhase.phase,
  );
  const phaseNumbersSet = new Set(phasesNumbers);
  const uniquePhaseNumbers = Array.from(phaseNumbersSet);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="text-muted-foreground flex-center gap-2 text-base">
          <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
          <span className="font-semibold">Workflow</span>
        </SidebarGroupLabel>
        <SidebarMenu>
          <ExecutionProgressMenuItem
            icon={CircleDashedIcon}
            label="Status"
            value={workflowExecutionData?.status}
          />

          <ExecutionProgressMenuItem
            icon={CalendarIcon}
            label="Started at"
            value={
              <span className="lowercase">
                {workflowExecutionData?.startedAt
                  ? formatDistanceToNow(
                      new Date(workflowExecutionData?.startedAt),
                      {
                        addSuffix: true,
                      },
                    )
                  : "-"}
              </span>
            }
          />

          <ExecutionProgressMenuItem
            icon={ClockIcon}
            label="Duration"
            value={"TODO"}
          />

          <ExecutionProgressMenuItem
            icon={CoinsIcon}
            label="Credits consumed"
            value={"TODO"}
          />
        </SidebarMenu>
      </SidebarGroup>
      <Separator />
      <SidebarGroup>
        <SidebarGroupLabel className="text-muted-foreground flex-center gap-2 text-base">
          <ListOrdered size={20} className="stroke-muted-foreground/80" />
          <span className="font-semibold">Phases</span>
        </SidebarGroupLabel>
        <SidebarMenu>
          {uniquePhaseNumbers.map((phaseNumber) => {
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
                            <span className="font-semibold">
                              {task.taskName}
                            </span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
