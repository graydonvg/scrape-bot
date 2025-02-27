import { WorkflowTask, WorkflowTaskType } from "../types";
import {
  launchBrowserTask,
  getPageHtmlTask,
  extractTextFromElementTask,
} from "./tasks";

export const taskRegistry: Record<WorkflowTaskType, WorkflowTask> = {
  LAUNCH_BROWSER: launchBrowserTask,
  GET_PAGE_HTML: getPageHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementTask,
};
