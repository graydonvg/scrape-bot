import {
  SidebarGroup,
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
import ExecutionProgressMenuItem from "../execution-progress-menu-item";
import { datesToDurationString } from "@/lib/utils";

type Props = {
  status?: string;
  startedAt?: string;
  completedAt?: string | null;
  creditsConsumed: number;
};

export default function WorkflowGroup({
  status,
  startedAt,
  completedAt,
  creditsConsumed,
}: Props) {
  const startedAtDate = startedAt ? new Date(startedAt) : undefined;
  const completedAtDate = completedAt ? new Date(completedAt) : undefined;
  const duration = datesToDurationString(startedAtDate, completedAtDate);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground flex-center gap-2 text-base">
        <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
        <span className="font-semibold">Workflow</span>
      </SidebarGroupLabel>
      <SidebarMenu>
        <ExecutionProgressMenuItem
          icon={CircleDashedIcon}
          label="Status"
          value={status || "-"}
        />
        <ExecutionProgressMenuItem
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
        <ExecutionProgressMenuItem
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
        <ExecutionProgressMenuItem
          icon={CoinsIcon}
          label="Credits consumed"
          value={creditsConsumed}
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}
