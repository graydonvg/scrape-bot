import "server-only";

import launchBrowserExecutor from "./launch-broswer";
import getPageHtmlExecutor from "./get-page-html";
import extractTextFromElementExecutor from "./extract-text-from-element.ts";
import { Logger } from "next-axiom";
import { Task, TaskType } from "@/lib/types/task";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";

type ExecutorFn<T extends Task> = (
  taskId: string,
  executionContext: ExecutionContext<T>,
  log: Logger,
) => Promise<ExecutorFunctionReturn>;

type ExecutorRegistry = {
  [K in TaskType]: ExecutorFn<Task & { type: K }>;
};

export const executorRegistry: ExecutorRegistry = {
  LAUNCH_BROWSER: launchBrowserExecutor,
  GET_PAGE_HTML: getPageHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementExecutor,
};
