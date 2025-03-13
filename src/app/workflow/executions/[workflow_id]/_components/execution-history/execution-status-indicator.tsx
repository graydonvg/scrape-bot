import { WorkflowExecutionStatusDb } from "@/lib/types/execution";
import { cn } from "@/lib/utils";

const indicatorColors: Record<WorkflowExecutionStatusDb, string> = {
  PENDING: "bg-muted-foreground",
  EXECUTING: "bg-violet-500",
  COMPLETED: "bg-green-500",
  FAILED: "bg-destructive",
  PARTIALLY_FAILED: "bg-warning",
};

type Props = {
  status: WorkflowExecutionStatusDb;
};

export default function ExecutionStatusIndicator({ status }: Props) {
  return <div className={cn("size-2 rounded-full", indicatorColors[status])} />;
}
