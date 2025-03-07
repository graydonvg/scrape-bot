import { Node } from "@xyflow/react";
import { Database } from "./supabase/database.types";
import { LucideProps } from "lucide-react";
import { ReactNode } from "react";
import { Browser, Page } from "puppeteer";

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

export type WorkflowStatusDb = Database["public"]["Enums"]["WorkflowStatus"];

export type WorkflowDb = Database["public"]["Tables"]["workflows"]["Row"];

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

export type WorkflowExecutionPhase = {
  phaseNumber: number;
  tasks: WorkflowTaskDb[];
};

export type ExecutionPhaseContext = {
  browser?: Browser;
  page?: Page;
  tasks: Record<
    string,
    {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    }
  >;
};

export type ExecutionContext<T extends WorkflowTask> = {
  getInput: (name: T["inputs"][number]["name"]) => string;

  setOutput: (name: T["outputs"][number]["name"], value: string) => void;

  getBrowser: () => Browser | undefined;
  setBrowser: (browser: Browser) => void;

  getPage: () => Page | undefined;
  setPage: (page: Page) => void;
};
