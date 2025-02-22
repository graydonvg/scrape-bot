import { Node } from "@xyflow/react";
import { Database } from "./supabase/database.types";
import { LucideProps } from "lucide-react";
import { ReactNode } from "react";

export type ActionReturn<T = void> = {
  success: boolean;
  field?: T;
  type?: string;
  message: string;
};

export type WorkflowStatus = Database["public"]["Enums"]["workflow_status"];

export type Workflow = Database["public"]["Tables"]["workflows"]["Row"];

export enum WorkflowTaskInputType {
  String = "STRING",
}

export enum WorkflowTaskType {
  LaunchBrowser = "LAUNCH_BROWSER",
}

export type WorkflowTaskInput = {
  name: string;
  type: string;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  [key: string]: unknown;
};

export type WorkflowTask = {
  type: WorkflowTaskType;
  label: string;
  icon: (props: LucideProps) => ReactNode;
  isEntryPoint: boolean;
  inputs: WorkflowTaskInput[];
};

export type WorkflowNodeData = {
  type: WorkflowTaskType;
  inputs: Record<string, string>;
  [key: string]: unknown;
};

export type WorkflowNode = Node & {
  data: WorkflowNodeData;
};
