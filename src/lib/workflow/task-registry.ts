import { WorkflowTask, WorkflowTaskType } from "../types";
import {
  launchBrowserTask,
  getPageHtmlTask,
  extractTextFromElementTask,
} from "./tasks";

type TaskRegistry = {
  [K in WorkflowTaskType]: WorkflowTask & { type: K };
};

export const taskRegistry: TaskRegistry = {
  LAUNCH_BROWSER: launchBrowserTask,
  GET_PAGE_HTML: getPageHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementTask,
};
