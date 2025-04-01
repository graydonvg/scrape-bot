import "server-only";

import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";
import { scrollToElementTask } from "../tasks/user-interaction";

export default async function scrollToElementExecutor(
  executionContext: ExecutionContext<typeof scrollToElementTask>,
): Promise<ExecutorFunctionReturn> {
  const logger = executionContext.logger.with({
    executor: "scrollToElementExecutor",
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

    const scrollResult = await executionContext
      .getPage()
      ?.evaluate((selector) => {
        const element = document.querySelector(selector);

        if (!element) {
          return {
            success: false,
            errorType: "user",
          } as ExecutorFunctionReturn;
        }

        const top = element.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({ top });
      }, selector);

    if (scrollResult && !scrollResult.success) {
      executionContext.logDb.ERROR(taskId, "Element not found");
      return scrollResult;
    }

    executionContext.logDb.INFO(taskId, "Scrolled to element");

    return { success: true };
  } catch (error) {
    if (taskId) {
      executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    }

    logger.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
