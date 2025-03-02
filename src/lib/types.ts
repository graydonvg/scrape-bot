import { Node } from "@xyflow/react";
import { Database } from "./supabase/database.types";
import { LucideProps } from "lucide-react";
import { ReactNode } from "react";

export type User = {
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatar?: string;
};

export type ActionReturn<T = void> = {
  success: boolean;
  field?: T;
  type?: string;
  message: string;
};

export type WorkflowStatus = Database["public"]["Enums"]["workflow_status"];

export type Workflow = Database["public"]["Tables"]["workflows"]["Row"];

export enum WorkflowTaskParamType {
  String = "STRING",
  BroswerInstance = "BROWSER_INSTANCE",
}

export enum WorkflowTaskType {
  LaunchBrowser = "LAUNCH_BROWSER",
  GetPageHtml = "GET_PAGE_HTML",
  ExtractTextFromElement = "EXTRACT_TEXT_FROM_ELEMENT",
}

export type WorkflowTaskInput = {
  name: string;
  type: WorkflowTaskParamType;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  variant?: string;
  [key: string]: unknown;
};

export type WorkflowTaskOutput = {
  name: string;
  type: WorkflowTaskParamType;
};

export type WorkflowTask = {
  type: WorkflowTaskType;
  label: string;
  credits: number;
  icon: (props: LucideProps) => ReactNode;
  isEntryPoint: boolean;
  inputs: WorkflowTaskInput[];
  outputs: WorkflowTaskOutput[];
};

export type WorkflowNodeData = {
  type: WorkflowTaskType;
  inputs: Record<string, string>;
  [key: string]: unknown;
};

export type WorkflowNode = Node & {
  data: WorkflowNodeData;
};

export type WorkflowExecutionPlan = {
  phase: number;
  nodes: WorkflowNode[];
};

export enum WorkflowExecutionPlanErrorType {
  "NO_ENTRY_POINT",
  "INVALID_INPUTS",
}

export type WorkflowNodeInvalidInputs = {
  nodeId: string;
  inputNames: string[];
};

export type WorkflowExecutionPlanError = {
  type: WorkflowExecutionPlanErrorType;
  invalidInputs?: WorkflowNodeInvalidInputs[];
};
