import "server-only";

import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { Logger } from "next-axiom";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";
import { waitForElementTask } from "../tasks/timing-controls";

export default async function waitForElementExecutor(
  taskId: string,
  executionContext: ExecutionContext<typeof waitForElementTask>,
  log: Logger,
): Promise<ExecutorFunctionReturn> {
  log.with({ executor: "waitForElementExecutor" });

  try {
    const selector = executionContext.getInput(TaskParamName.Selector);

    if (!selector) {
      log.error(`${TaskParamName.Selector} undefined`);
      executionContext.logDb.ERROR(
        taskId,
        `${TaskParamName.Selector} undefined`,
      );
      return { success: false, errorType: "internal" };
    }

    const visibility = executionContext.getInput(TaskParamName.Visibility);

    if (!visibility) {
      log.error(`${TaskParamName.Visibility} undefined`);
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

    await executionContext.getPage()?.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
      timeout:
        maxWaitTime && !isInvalidMaxWaitTime ? maxWaitTimeNumber : undefined,
    });

    executionContext.logDb.INFO(taskId, `Element became ${visibility}`);

    return { success: true };
  } catch (error) {
    executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    log.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
