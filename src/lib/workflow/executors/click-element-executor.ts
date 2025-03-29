import "server-only";

import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { Logger } from "next-axiom";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";
import { clickElementTask } from "../tasks/user-interaction";

export default async function clickElementExecutor(
  taskId: string,
  executionContext: ExecutionContext<typeof clickElementTask>,
  log: Logger,
): Promise<ExecutorFunctionReturn> {
  log.with({ executor: "clickElementExecutor" });

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

    await executionContext.getPage()?.click(selector);

    executionContext.logDb.INFO(taskId, "Element clicked successfully");

    return { success: true };
  } catch (error) {
    executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    log.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
