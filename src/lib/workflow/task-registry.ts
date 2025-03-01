import { WorkflowTask, WorkflowTaskType } from "../types";
import {
  getPageHtmlTask,
  extractTextFromElementTask,
} from "./tasks/data-extraction";
import { launchBrowserTask } from "./tasks/entry-point";

type TaskRegistry = {
  [K in WorkflowTaskType]: WorkflowTask & { type: K };
};

export const taskRegistry: TaskRegistry = {
  LAUNCH_BROWSER: launchBrowserTask,
  GET_PAGE_HTML: getPageHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementTask,
};
