import { Node } from "@xyflow/react";
import { Database } from "../supabase/database.types";
import { TaskType } from "./task";

export type WorkflowDb = Database["public"]["Tables"]["workflows"]["Row"];

export type WorkflowStatusDb = Database["public"]["Enums"]["WorkflowStatus"];

export type WorkflowNodeData = {
  type: TaskType;
  inputs: Record<string, string>;
  [key: string]: unknown;
};

export interface WorkflowNode extends Node {
  data: WorkflowNodeData;
}
