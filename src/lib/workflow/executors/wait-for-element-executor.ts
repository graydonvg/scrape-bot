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

    executionContext.logDb.INFO(taskId, "Waiting for element");

    try {
      const element = await executionContext
        .getPage()
        ?.waitForSelector(selector, {
          visible: visibility === "visible",
          hidden: visibility === "hidden",
        });

      if (!element) {
        executionContext.logDb.ERROR(taskId, "Element not found");
        return { success: false, errorType: "user" };
      }
    } catch (error) {
      if (error instanceof Error && error.name === "TimeoutError") {
        if (taskId) {
          executionContext.logDb.ERROR(taskId, error.message);
        }

        return { success: false, errorType: "user" };
      }

      throw error;
    }

    executionContext.logDb.INFO(taskId, `Element became ${visibility}`);

    return { success: true };
  } catch (error) {
    if (taskId) {
      executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    }

    logger.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
