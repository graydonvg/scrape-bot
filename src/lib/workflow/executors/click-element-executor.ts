import "server-only";

import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";
import { clickElementTask } from "../tasks/user-interaction";

export default async function clickElementExecutor(
  executionContext: ExecutionContext<typeof clickElementTask>,
): Promise<ExecutorFunctionReturn> {
  const logger = executionContext.logger.with({
    executor: "clickElementExecutor",
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

    try {
      await executionContext.getPage()?.click(selector);
    } catch (error) {
      if (error instanceof Error) {
        executionContext.logDb.ERROR(taskId, error.message);

        if (error.message.includes("No element found for selector")) {
          return { success: false, errorType: "user" };
        }

        return { success: false, errorType: "internal" };
      }

      return { success: false, errorType: "internal" };
    }

    executionContext.logDb.INFO(taskId, "Element clicked");

    return { success: true };
  } catch (error) {
    if (taskId) {
      executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    }

    logger.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
