import { ExecutionContext, WorkflowTask, WorkflowTaskType } from "@/lib/types";
import launchBrowserExecutor from "./launch-broswer";
import getPageHtmlExecutor from "./get-page-html";
import extractTextFromElementExecutor from "./extract-text-from-element.ts";

type ExecutorFn<T extends WorkflowTask> = (
  taskId: string,
  nodeId: string,
  executionContext: ExecutionContext<T>,
) => Promise<{ taskId: string; nodeId: string; success: boolean }>;

type ExecutorRegistry = {
  [K in WorkflowTaskType]: ExecutorFn<WorkflowTask & { type: K }>;
};

export const executorRegistry: ExecutorRegistry = {
  LAUNCH_BROWSER: launchBrowserExecutor,
  GET_PAGE_HTML: getPageHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementExecutor,
};
