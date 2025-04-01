import "server-only";

import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";
import { navigateToUrlTask } from "../tasks/user-interaction";

export default async function navigateToUrlExecutor(
  executionContext: ExecutionContext<typeof navigateToUrlTask>,
): Promise<ExecutorFunctionReturn> {
  const logger = executionContext.logger.with({
    executor: "navigateToUrlExecutor",
  });

  let taskId: string | null = null;

  try {
    taskId = executionContext.getTaskId();

    if (!taskId) logger.error("Task ID undefined");

    const url = executionContext.getInput(TaskParamName.WebsiteUrl);

    if (!url) {
      logger.error(`${TaskParamName.WebsiteUrl} undefined`);
      executionContext.logDb.ERROR(
        taskId,
        `${TaskParamName.WebsiteUrl} undefined`,
      );
      return { success: false, errorType: "internal" };
    }

    await executionContext.getPage()?.goto(url);

    executionContext.logDb.INFO(taskId, `Visiting ${url}`);

    return { success: true };
  } catch (error) {
    if (taskId) {
      executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    }

    logger.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
