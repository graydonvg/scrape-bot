import { Browser as CoreBrowser, Page as CorePage } from "puppeteer-core";
import { Browser, Page } from "puppeteer";
import { Database } from "../supabase/database.types";
import { Task, TaskDb } from "./task";
import { LogCollector } from "./log";
import { WorkflowNode } from "./workflow";
import { Logger } from "next-axiom";

export type WorkflowExecutionStatusDb =
  Database["public"]["Enums"]["WorkflowExecutionStatus"];

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
  tasks: TaskDb[];
};

export type ExecutorFunctionErrorType = "user" | "internal";

export type ExecutorFunctionReturn =
  | { success: true }
  | { success: false; errorType: ExecutorFunctionErrorType };

export type PhaseResult = {
  success: boolean;
  taskId: string;
  nodeId: string;
  creditsConsumed: number;
  error?: unknown;
  errorType?: ExecutorFunctionErrorType;
};

export type ExecutionPhaseContext = {
  browser?: Browser;
  page?: Page;
  userId: string;
  tasks: Record<
    string,
    {
      taskId: string;
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    }
  >;
};

export type ExecutionContext<T extends Task> = {
  getUserId: () => string;

  getTaskId: () => string;

  getInput: (name: T["inputs"][number]["name"]) => string;

  setOutput: (name: T["outputs"][number]["name"], value: string) => void;

  getBrowser: () => Browser | CoreBrowser | undefined;
  setBrowser: (browser: Browser | CoreBrowser) => void;

  getPage: () => Page | CorePage | undefined;
  setPage: (page: Page | CorePage) => void;

  logDb: LogCollector;
  logger: Logger;
};
