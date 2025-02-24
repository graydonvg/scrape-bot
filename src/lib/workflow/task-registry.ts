import { WorkflowTask, WorkflowTaskType } from "../types";
import { launchBrowserTask, getPageHtmlTask } from "./tasks";

export const taskRegistry: Record<WorkflowTaskType, WorkflowTask> = {
  LAUNCH_BROWSER: launchBrowserTask,
  GET_PAGE_HTML: getPageHtmlTask,
};
