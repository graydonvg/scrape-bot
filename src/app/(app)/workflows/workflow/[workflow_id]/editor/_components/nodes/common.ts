import { TaskParamType } from "@/lib/types/task";

// Select has no handle
type ExcludedTaskParamType = Exclude<
  Exclude<TaskParamType, TaskParamType.Select>,
  TaskParamType.Credential
>;

export const nodeHandleColor: Record<ExcludedTaskParamType, string> = {
  BROWSER_INSTANCE: "!bg-amber-400",
  STRING: "!bg-violet-400",
  // CREDENTIAL: "!bg-teal-400",
};
