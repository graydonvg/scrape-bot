import { TaskParamType } from "@/lib/types/task";

export const nodeHandleColor: Record<TaskParamType, string> = {
  BROWSER_INSTANCE: "!bg-amber-400",
  STRING: "!bg-violet-400",
  CREDENTIAL: "",
  SELECT: "",
};
