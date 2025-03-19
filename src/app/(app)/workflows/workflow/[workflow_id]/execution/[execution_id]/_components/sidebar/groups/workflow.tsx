import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  NetworkIcon,
  PlayIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  datesToDurationString,
  getFormattedWorkflowExecutionStatus,
  stringToDate,
} from "@/lib/utils";
import AnimatedCounter from "@/components/animated-counter";
import WorkflowExecutionDetail from "@/app/(app)/workflows/workflow/_components/workflow-execution-detail";
import getWorkflowExecutionWithTasksClient from "../../../_data-access/get-execution-with-tasks-client";
import ViewAllExecutionsButton from "@/app/(app)/workflows/workflow/_components/sidebar/view-all-executions-button";
import { executionStatusColors } from "@/app/(app)/workflows/workflow/common";

type Props = {
  workflowExecutionData: Awaited<
    ReturnType<typeof getWorkflowExecutionWithTasksClient>
  >;
  creditsConsumed: number;
};

export default function Workflow({
  workflowExecutionData,
  creditsConsumed,
}: Props) {
  const startedAtDate = stringToDate(workflowExecutionData?.startedAt);
  const completedAtDate = stringToDate(workflowExecutionData?.completedAt);
  const duration = datesToDurationString(startedAtDate, completedAtDate);

  return (
    <SidebarGroup className="py-4">
      <SidebarGroupLabel className="mb-2 flex items-center gap-2">
        <NetworkIcon className="stroke-muted-foreground/80 -rotate-90" />
        <span className="text-foreground truncate text-base">
          {workflowExecutionData?.workflows?.name}
        </span>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <WorkflowExecutionDetail
            icon={CircleDashedIcon}
            label="Status"
            value={
              workflowExecutionData?.status ? (
                <span
                  className={
                    executionStatusColors[workflowExecutionData.status]
                  }
                >
                  {getFormattedWorkflowExecutionStatus(
                    workflowExecutionData.status,
                  )}
                </span>
              ) : (
                "-"
              )
            }
          />
          <WorkflowExecutionDetail
            icon={PlayIcon}
            label="Trigger"
            value={workflowExecutionData?.trigger}
          />
          <WorkflowExecutionDetail
            icon={CalendarIcon}
            label="Started at"
            value={
              startedAtDate
                ? formatDistanceToNow(startedAtDate, {
                    addSuffix: true,
                  })
                : "-"
            }
          />
          <WorkflowExecutionDetail
            icon={ClockIcon}
            label="Duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader2Icon size={20} className="animate-spin" />
              )
            }
          />
          <WorkflowExecutionDetail
            icon={CoinsIcon}
            label="Credits consumed"
            value={<AnimatedCounter value={creditsConsumed} />}
          />
          <ViewAllExecutionsButton
            workflowId={workflowExecutionData!.workflowId!}
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
