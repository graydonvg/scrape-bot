import "server-only";

import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";
import { waitForElementTask } from "../tasks/timing-controls";

export default async function waitForElementExecutor(
  executionContext: ExecutionContext<typeof waitForElementTask>,
): Promise<ExecutorFunctionReturn> {
  const logger = executionContext.logger.with({
    executor: "waitForElementExecutor",
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

    const visibility = executionContext.getInput(TaskParamName.Visibility);

    if (!visibility) {
      logger.error(`${TaskParamName.Visibility} undefined`);
      executionContext.logDb.ERROR(
        taskId,
        `${TaskParamName.Visibility} undefined`,
      );
      return { success: false, errorType: "internal" };
    }

    const maxWaitTime = executionContext.getInput(TaskParamName.MaxWaitTime);

    const maxWaitTimeNumber = parseInt(maxWaitTime);
    const isInvalidMaxWaitTime =
      maxWaitTime && maxWaitTime.length > 0 && isNaN(maxWaitTimeNumber);

    if (isInvalidMaxWaitTime) {
      executionContext.logDb.ERROR(
        taskId,
        `${TaskParamName.MaxWaitTime} is not a valid number. Using default value.`,
      );
      return { success: false, errorType: "user" };
    }

    const element = await executionContext
      .getPage()
      ?.waitForSelector(selector, {
        visible: visibility === "visible",
        hidden: visibility === "hidden",
        timeout:
          maxWaitTime && !isInvalidMaxWaitTime ? maxWaitTimeNumber : undefined,
      });

    if (!element) {
      executionContext.logDb.ERROR(taskId, "Element not found");
      return { success: false, errorType: "user" };
    }

    executionContext.logDb.INFO(taskId, `Element became ${visibility}`);

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      if (taskId) {
        executionContext.logDb.ERROR(taskId, error.message);
      }

      return { success: false, errorType: "user" };
    }

    if (taskId) {
      executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    }

    logger.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
