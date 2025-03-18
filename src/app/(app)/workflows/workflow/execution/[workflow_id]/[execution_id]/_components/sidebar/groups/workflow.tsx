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
import { datesToDurationString } from "@/lib/utils";
import { WorkflowExecutionStatusDb } from "@/lib/types/execution";
import AnimatedCounter from "@/components/animated-counter";
import WorkflowExecutionDetail from "@/app/(app)/workflows/workflow/_components/workflow-execution-detail";
import getWorkflowExecutionWithTasksClient from "../../../_data-access/get-execution-with-tasks-client";
import ViewAllExecutionsButton from "@/app/(app)/workflows/workflow/_components/sidebar/view-all-executions-button";

const statusColors: Record<WorkflowExecutionStatusDb, string> = {
  PENDING: "text-muted-foreground",
  EXECUTING: "text-violet-500",
  COMPLETED: "text-success dark:text-green-500",
  FAILED: "text-destructive",
  PARTIALLY_FAILED: "text-warning",
};

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
  const startedAtDate = workflowExecutionData?.startedAt
    ? new Date(workflowExecutionData?.startedAt)
    : null;
  const completedAtDate = workflowExecutionData?.completedAt
    ? new Date(workflowExecutionData?.completedAt)
    : null;
  const duration = datesToDurationString(startedAtDate, completedAtDate);
  const formattedStatus = workflowExecutionData?.status?.split("_").join(" ");

  return (
    <SidebarGroup className="py-4">
      <SidebarGroupLabel className="mb-2 flex items-center gap-2 border-b">
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
                <span className={statusColors[workflowExecutionData?.status]}>
                  {formattedStatus}
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
