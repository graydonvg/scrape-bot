import { TaskParamType } from "@/lib/types/task";

export const nodeHandleColor: Record<TaskParamType, string> = {
  [TaskParamType.BrowserInstance]: "!bg-amber-400",
  [TaskParamType.String]: "!bg-violet-400",
};
