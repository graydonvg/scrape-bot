import { WorkflowTask, WorkflowTaskType } from "@/lib/types";
import { launchBrowserTask } from "./entry-point";
import { extractTextFromElementTask, getPageHtmlTask } from "./data-extraction";

type TaskRegistry = {
  [K in WorkflowTaskType]: WorkflowTask & {
    type: K;
  };
};

export const taskRegistry: TaskRegistry = {
  LAUNCH_BROWSER: launchBrowserTask,
  GET_PAGE_HTML: getPageHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementTask,
};
