import { Browser, Page } from "puppeteer";
import { Database } from "../supabase/database.types";
import { WorkflowNode, WorkflowTask, WorkflowTaskDb } from "./workflow";
import { LogCollector } from "./log";

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

  logDb: LogCollector;
};
