import "server-only";

import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { extractTextFromElementTask } from "../tasks/data-extraction";
import * as cheerio from "cheerio";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";

export default async function extractTextFromElementExecutor(
  executionContext: ExecutionContext<typeof extractTextFromElementTask>,
): Promise<ExecutorFunctionReturn> {
  const logger = executionContext.logger.with({
    executor: "extractTextFromElementExecutor",
  });

  let taskId: string | null = null;

  try {
    taskId = executionContext.getTaskId();

    if (!taskId) logger.error("Task ID undefined");

    const selector = executionContext.getInput(TaskParamName.Selector);

    if (!selector) {
      logger.error(`${TaskParamName.Selector} undefined`);
      executionContext.logDb.ERROR(
        taskId,
        `${TaskParamName.Selector} undefined`,
      );
      return { success: false, errorType: "internal" };
    }

    const html = executionContext.getInput(TaskParamName.Html);

    if (!html) {
      logger.error(`${TaskParamName.Html} undefined`);
      executionContext.logDb.ERROR(taskId, `${TaskParamName.Html} undefined`);
      return { success: false, errorType: "internal" };
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
    if (taskId) {
      executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    }

    logger.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
