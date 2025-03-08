import "server-only";

import launchBrowserExecutor from "./launch-broswer";
import getPageHtmlExecutor from "./get-page-html";
import extractTextFromElementExecutor from "./extract-text-from-element.ts";
import { Logger } from "next-axiom";
import { WorkflowTask, WorkflowTaskType } from "@/lib/types/workflow";
import { ExecutionContext } from "@/lib/types/execution";

type ExecutorFn<T extends WorkflowTask> = (
  taskId: string,
  executionContext: ExecutionContext<T>,
  log: Logger,
) => Promise<{ success: boolean }>;

type ExecutorRegistry = {
  [K in WorkflowTaskType]: ExecutorFn<WorkflowTask & { type: K }>;
};

export const executorRegistry: ExecutorRegistry = {
  LAUNCH_BROWSER: launchBrowserExecutor,
  GET_PAGE_HTML: getPageHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementExecutor,
};
