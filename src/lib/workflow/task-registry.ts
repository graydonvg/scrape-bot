import { WorkflowTask, WorkflowTaskType } from "../types";
import { launchBrowserTask } from "./tasks";

export const taskRegistry: Record<WorkflowTaskType, WorkflowTask> = {
  LAUNCH_BROWSER: launchBrowserTask,
};
