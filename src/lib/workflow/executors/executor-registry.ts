import { ExecutionContext, WorkflowTask, WorkflowTaskType } from "@/lib/types";
import launchBrowserExecutor from "./launch-broswer";
import getPageHtmlExecutor from "./get-page-html";
import extractTextFromElementExecutor from "./extract-text-from-element.ts";

type ExecutorRegistry = {
  [K in WorkflowTaskType]: (
    taskId: string,
    executionContext: ExecutionContext<WorkflowTask>,
  ) => Promise<{ taskId: string; success: boolean }>;
};

export const executorRegistry: ExecutorRegistry = {
  LAUNCH_BROWSER: launchBrowserExecutor,
  GET_PAGE_HTML: getPageHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementExecutor,
};
