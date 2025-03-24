import { goToWebsiteTask } from "./entry-point";
import { extractTextFromElementTask, getPageHtmlTask } from "./data-extraction";
import { Task, TaskType } from "@/lib/types/task";

type TaskRegistry = {
  [K in TaskType]: Task & {
    type: K;
  };
};

export const taskRegistry: TaskRegistry = {
  GO_TO_WEBSITE: goToWebsiteTask,
  GET_PAGE_HTML: getPageHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementTask,
};
