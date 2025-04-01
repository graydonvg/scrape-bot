import "server-only";

import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { getPageHtmlTask } from "../tasks/data-extraction";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";

export default async function getPageHtmlExecutor(
  executionContext: ExecutionContext<typeof getPageHtmlTask>,
): Promise<ExecutorFunctionReturn> {
  const logger = executionContext.logger.with({
    executor: "getPageHtmlExecutor",
  });

  let taskId: string | null = null;

  try {
    taskId = executionContext.getTaskId();

    if (!taskId) logger.error("Task ID undefined");

    const html = await executionContext.getPage()?.content();

    if (!html) {
      logger.error("HTML undefined");
      executionContext.logDb.ERROR(taskId, "Failed to extract HTML from page");
      return { success: false, errorType: "internal" };
    }

    executionContext.logDb.INFO(taskId, "Extracted HTML from page");

    executionContext.setOutput(TaskParamName.Html, html);

    return { success: true };
  } catch (error) {
    if (taskId) {
      executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    }

    logger.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
