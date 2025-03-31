import { goToWebsiteTask } from "./entry-point";
import {
  extractDataWithAiTask,
  extractTextFromElementTask,
  getPageHtmlTask,
  extractPropertyFromJsonTask,
} from "./data-extraction";
import { Task, TaskType } from "@/lib/types/task";
import { clickElementTask, fillInputFieldTask } from "./user-interaction";
import { waitForElementTask } from "./timing-controls";
import { deliverViaWebhookTask } from "./results";
import { addPropertyToJsonTask } from "./data-insertion";

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
  EXTRACT_DATA_WITH_AI: extractDataWithAiTask,
  EXTRACT_PROPERTY_FROM_JSON: extractPropertyFromJsonTask,
  ADD_PROPERTY_TO_JSON: addPropertyToJsonTask,
};
