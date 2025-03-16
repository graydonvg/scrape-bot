import { Separator } from "@/components/ui/separator";
import ActionButtons from "./action-buttons";
import TaskMenu from "./task-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  CalendarIcon,
  CoinsIcon,
  HistoryIcon,
  NetworkIcon,
  TagIcon,
} from "lucide-react";
import AnimatedCounter from "@/components/animated-counter";
import WorkflowExecutionDetail from "@/components/workflow-execution-detail";
import Link from "next/link";

type Props = {
  workflowId: string;
};

export default function WorkflowEditorSidebar({ workflowId }: Props) {
  return (
    <div className="bg-sidebar flex h-full w-[300px] max-w-[300px] min-w-[300px] flex-col border-r md:ml-12 md:w-[320px] md:max-w-[320px] md:min-w-[320px]">
      <SidebarGroup className="py-4">
        <SidebarGroupLabel className="text-muted-foreground flex-center gap-2 text-base">
          <NetworkIcon
            size={20}
            className="stroke-muted-foreground/80 -rotate-90"
          />
          <span className="font-semibold">Workflow</span>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <WorkflowExecutionDetail icon={TagIcon} label="Name" value="TODO" />
            <WorkflowExecutionDetail
              icon={CoinsIcon}
              label="Credit cost"
              value={
                // TODO: Make value dynamic
                // <AnimatedCounter value={12} />
                "TODO"
              }
            />
            <WorkflowExecutionDetail
              icon={CalendarIcon}
              label="Last Executed"
              value="TODO"
            />
            <SidebarMenuItem className="mt-2 px-4">
              <Link href={`/workflows/workflow/executions/${workflowId}`}>
                <SidebarMenuButton variant="outline" className="justify-center">
                  <HistoryIcon className="stroke-muted-foreground" />
                  {/* TODO: Hide if never executed */}
                  View Past Executions
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <Separator />
      <TaskMenu />
      <Separator />
      <div className="p-4">
        <ActionButtons workflowId={workflowId} />
      </div>
    </div>
  );
}
