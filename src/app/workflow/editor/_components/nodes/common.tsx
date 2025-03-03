import { WorkflowTaskParamType } from "@/lib/types";

export const nodeHandleColor: Record<WorkflowTaskParamType, string> = {
  [WorkflowTaskParamType.BroswerInstance]: "!bg-amber-400",
  [WorkflowTaskParamType.String]: "!bg-violet-400",
};
