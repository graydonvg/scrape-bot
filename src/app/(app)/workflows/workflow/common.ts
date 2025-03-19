import { WorkflowExecutionStatusDb } from "@/lib/types/execution";

export const executionStatusColors: Record<WorkflowExecutionStatusDb, string> =
  {
    PENDING: "text-muted-foreground",
    EXECUTING: "text-violet-500",
    COMPLETED: "text-success dark:text-green-500",
    FAILED: "text-destructive",
    PARTIALLY_FAILED: "text-warning",
  };
