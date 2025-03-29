import { TaskParamType } from "@/lib/types/task";

// Select has no handle
type ExcludedTaskParamType = Exclude<TaskParamType, TaskParamType.Select>;

export const nodeHandleColor: Record<ExcludedTaskParamType, string> = {
  BROWSER_INSTANCE: "!bg-amber-400",
  STRING: "!bg-violet-400",
};
