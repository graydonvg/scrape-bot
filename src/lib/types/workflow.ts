import { LucideProps } from "lucide-react";
import { ReactNode } from "react";
import { Database } from "../supabase/database.types";
import { Node } from "@xyflow/react";

export type WorkflowDb = Database["public"]["Tables"]["workflows"]["Row"];

export type WorkflowStatusDb = Database["public"]["Enums"]["WorkflowStatus"];

export type WorkflowTaskDb = Database["public"]["Tables"]["tasks"]["Row"];

export enum WorkflowTaskParamType {
  String = "STRING",
  BrowserInstance = "BROWSER_INSTANCE",
}

export enum WorkflowTaskParamName {
  WebsiteUrl = "Website URL",
  WebPage = "Web page",
  Html = "HTML",
  Selector = "Selector",
  ExtractedText = "Extracted text",
}

export enum WorkflowTaskType {
  LaunchBrowser = "LAUNCH_BROWSER",
  GetPageHtml = "GET_PAGE_HTML",
  ExtractTextFromElement = "EXTRACT_TEXT_FROM_ELEMENT",
}

export type WorkflowTaskInput = {
  name: WorkflowTaskParamName;
  type: WorkflowTaskParamType;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  variant?: string;
  [key: string]: unknown;
};

export type WorkflowTaskOutput = {
  name: WorkflowTaskParamName;
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
