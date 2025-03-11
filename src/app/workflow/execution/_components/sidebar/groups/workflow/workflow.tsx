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
  WorkflowIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import WorkflowExecutionDetail from "./workflow-execution-detail";
import { datesToDurationString } from "@/lib/utils";
import { WorkflowExecutionStatusDb } from "@/lib/types/execution";

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
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground flex-center gap-2 text-base">
        <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
        <span className="font-semibold">Workflow</span>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <WorkflowExecutionDetail
            icon={CircleDashedIcon}
            label="Status"
            value={formattedStatus || "-"}
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
            value={creditsConsumed}
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
