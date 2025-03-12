import "server-only";

import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from "@/lib/constants";
import { extractTextFromElementTask } from "../tasks/data-extraction";
import * as cheerio from "cheerio";
import { Logger } from "next-axiom";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";

export default async function extractTextFromElementExecutor(
  taskId: string,
  executionContext: ExecutionContext<typeof extractTextFromElementTask>,
  log: Logger,
): Promise<ExecutorFunctionReturn> {
  log.with({ executor: "extractTextFromElementExecutor" });

  try {
    const selector = executionContext.getInput(TaskParamName.Selector);

    if (!selector) {
      log.error("Selector undefined");
      executionContext.logDb.ERROR(taskId, "Selector undefined");
      return { success: false, errorType: "server" };
    }

    const html = executionContext.getInput(TaskParamName.Html);

    if (!html) {
      log.error("HTML undefined");
      executionContext.logDb.ERROR(taskId, "HTML undefined");
      return { success: false, errorType: "server" };
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      executionContext.logDb.ERROR(taskId, "Element not found");
      return { success: false, errorType: "user" };
    }

    const extractedText = $.text(element);

    if (!extractedText) {
      executionContext.logDb.ERROR(
        taskId,
        "Invalid selector or element has no text",
      );
      return { success: false, errorType: "user" };
    }

    executionContext.logDb.INFO(
      taskId,
      "Extracted text from element successfully",
    );

    executionContext.setOutput(TaskParamName.ExtractedText, extractedText);

    return { success: true };
  } catch (error) {
    executionContext.logDb.ERROR(taskId, USER_ERROR_MESSAGES.Unexpected);
    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return { success: false, errorType: "server" };
  }
}
