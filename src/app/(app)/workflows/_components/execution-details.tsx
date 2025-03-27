import ExecutionStatusIndicator from "@/components/execution-status-indicator";
import { WorkflowDb } from "@/lib/types/workflow";
import {
  cn,
  getFormattedWorkflowExecutionStatus,
  stringToDate,
} from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ChevronRightIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { executionStatusColors } from "../workflow/common";
import useWorkflowsStore from "@/lib/store/workflows-store";

type Props = {
  workflow: WorkflowDb;
};

export default function ExecutionDetails({ workflow }: Props) {
  const {
    lastExecutedAt,
    lastExecutionStatus,
    workflowId,
    lastExecutionId,
    nextExecutionAt,
    status,
  } = workflow;
  const { setSelectedTaskId } = useWorkflowsStore();
  const lastExecutedAtDate = stringToDate(lastExecutedAt);
  const formattedLastExecutedAt =
    lastExecutedAtDate &&
    formatDistanceToNow(lastExecutedAtDate, {
      addSuffix: true,
    });
  const formattedNextExecutionAt =
    nextExecutionAt && format(nextExecutionAt, "yyyy-MM-dd HH:mm");
  const formattedNextExecutionAtUtc =
    nextExecutionAt && formatInTimeZone(nextExecutionAt, "UTC", "HH:mm");

  return (
    <div className="bg-primary/5 text-muted-foreground flex w-full items-center justify-between px-4 py-1">
      <div className="flex items-center gap-2 text-sm">
        {lastExecutedAt && lastExecutionStatus && (
          <Link
            onClick={() => setSelectedTaskId(null)}
            href={`/workflows/workflow/${workflowId}/execution/${lastExecutionId}`}
            className="group flex items-center gap-2"
          >
            <span>Last execution:</span>
            <ExecutionStatusIndicator status={lastExecutionStatus} />
            <span
              className={cn(
                "lowercase",
                executionStatusColors[lastExecutionStatus],
              )}
            >
              {getFormattedWorkflowExecutionStatus(lastExecutionStatus)}
            </span>
            <span>{formattedLastExecutedAt}</span>
            <ChevronRightIcon className="size-3.5 -translate-x-0.5 transition-transform group-hover:translate-x-0" />
          </Link>
        )}
        {!lastExecutedAt && status === "PUBLISHED" && <p>Not executed yet</p>}
      </div>
      {nextExecutionAt && (
        <div className="flex items-center gap-2 text-sm">
          <ClockIcon className="size-3.5" />
          <span>Next execution at:</span>
          <span>{formattedNextExecutionAt}</span>
          <span>({formattedNextExecutionAtUtc} UTC)</span>
        </div>
      )}
    </div>
  );
}
