import { goToWebsiteTask } from "./entry-point";
import { extractTextFromElementTask, getPageHtmlTask } from "./data-extraction";
import { Task, TaskType } from "@/lib/types/task";
import { clickElementTask, fillInputFieldTask } from "./user-interaction";
import { waitForElementTask } from "./timing-controls";
import { deliverViaWebhookTask } from "./results";

type TaskRegistry = {
  [K in TaskType]: Task & {
    type: K;
  };
};

export const taskRegistry: TaskRegistry = {
  GO_TO_WEBSITE: goToWebsiteTask,
  GET_PAGE_HTML: getPageHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementTask,
  FILL_INPUT_FIELD: fillInputFieldTask,
  CLICK_ELEMENT: clickElementTask,
  WAIT_FOR_ELEMENT: waitForElementTask,
  DELIVER_VIA_WEBHOOK: deliverViaWebhookTask,
};
