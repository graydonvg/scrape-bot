import { TaskParamType } from "@/lib/types/task";

type ExcludedTaskParamType = Exclude<
  Exclude<TaskParamType, TaskParamType.Select>,
  TaskParamType.Credential
>;

export const nodeHandleColor: Record<ExcludedTaskParamType, string> = {
  BROWSER_INSTANCE: "!bg-amber-400",
  STRING: "!bg-violet-400",
};
