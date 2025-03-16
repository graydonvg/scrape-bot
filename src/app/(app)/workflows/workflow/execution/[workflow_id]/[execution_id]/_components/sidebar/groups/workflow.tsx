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
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { datesToDurationString } from "@/lib/utils";
import { WorkflowExecutionStatusDb } from "@/lib/types/execution";
import AnimatedCounter from "@/components/animated-counter";
import WorkflowExecutionDetail from "@/components/workflow-execution-detail";

const statusColors: Record<WorkflowExecutionStatusDb, string> = {
  PENDING: "text-muted-foreground",
  EXECUTING: "text-violet-500",
  COMPLETED: "text-success dark:text-green-500",
  FAILED: "text-destructive",
  PARTIALLY_FAILED: "text-warning",
};

type Props = {
  status?: WorkflowExecutionStatusDb;
  startedAt?: string;
  completedAt?: string | null;
  creditsConsumed: number;
};

export default function Workflow({
  status,
  startedAt,
  completedAt,
  creditsConsumed,
}: Props) {
  const startedAtDate = startedAt ? new Date(startedAt) : null;
  const completedAtDate = completedAt ? new Date(completedAt) : null;
  const duration = datesToDurationString(startedAtDate, completedAtDate);
  const formattedStatus = status?.split("_").join(" ");

  return (
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
          <WorkflowExecutionDetail
            icon={CircleDashedIcon}
            label="Status"
            value={
              status ? (
                <span className={statusColors[status]}>{formattedStatus}</span>
              ) : (
                "-"
              )
            }
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
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
