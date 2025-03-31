import "server-only";

import goToWebsiteExecutor from "./go-to-website";
import getPageHtmlExecutor from "./get-page-html";
import extractTextFromElementExecutor from "./extract-text-from-element.ts";
import { Task, TaskType } from "@/lib/types/task";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import fillInputFieldExecutor from "./fill-input-field";
import clickElementExecutor from "./click-element-executor";
import waitForElementExecutor from "./wait-for-element-executor";
import deliverViaWebhookExecutor from "./deliver-via-webhook-executor";
import extractDataWithAiExecutor from "./extract-data-with-ai-executor";
import extractPropertyFromJsonExecutor from "./extract-property-from-json-executor";
import addPropertyToJsonExecutor from "./add-property-to-json-executor";

type ExecutorFn<T extends Task> = (
  executionContext: ExecutionContext<T>,
) => Promise<ExecutorFunctionReturn>;

type ExecutorRegistry = {
  [K in TaskType]: ExecutorFn<Task & { type: K }>;
};

export const executorRegistry: ExecutorRegistry = {
  GO_TO_WEBSITE: goToWebsiteExecutor,
  GET_PAGE_HTML: getPageHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementExecutor,
  FILL_INPUT_FIELD: fillInputFieldExecutor,
  CLICK_ELEMENT: clickElementExecutor,
  WAIT_FOR_ELEMENT: waitForElementExecutor,
  DELIVER_VIA_WEBHOOK: deliverViaWebhookExecutor,
  EXTRACT_DATA_WITH_AI: extractDataWithAiExecutor,
  EXTRACT_PROPERTY_FROM_JSON: extractPropertyFromJsonExecutor,
  ADD_PROPERTY_TO_JSON: addPropertyToJsonExecutor,
};
