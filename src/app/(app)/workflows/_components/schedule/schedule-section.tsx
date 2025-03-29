import { CoinsIcon, CornerDownRightIcon, MoveRightIcon } from "lucide-react";
import TooltipWrapper from "@/components/tooltip-wrapper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import useUserStore from "@/lib/store/user-store";
import SchedulerDialog from "./scheduler-dialog";

type Props = {
  workflowId: string;
  isDraft: boolean;
  creditCost: number;
  cron: string | null;
};

export default function ScheduleSection({
  workflowId,
  isDraft,
  creditCost,
  cron,
}: Props) {
  const { userCreditBalance } = useUserStore();

  if (isDraft) return null;

  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="stroke-muted-foreground size-4" />
      <SchedulerDialog
        key={cron}
        workflowId={workflowId}
        creditCost={creditCost}
        cron={cron}
      />
      <MoveRightIcon className="stroke-muted-foreground size-4" />
      <TooltipWrapper tooltipContent="Total credit cost">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="border-muted-foreground/30 space-x-2"
          >
            <CoinsIcon className="stroke-primary size-4! dark:stroke-blue-500" />
            <span
              className={cn("text-sm", {
                "text-destructive":
                  userCreditBalance !== null && userCreditBalance < creditCost,
              })}
            >
              {creditCost}
            </span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
}
