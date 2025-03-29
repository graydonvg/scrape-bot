import "server-only";

import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { Logger } from "next-axiom";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";
import { fillInputFieldTask } from "../tasks/user-interaction";

export default async function fillInputFieldExecutor(
  taskId: string,
  executionContext: ExecutionContext<typeof fillInputFieldTask>,
  log: Logger,
): Promise<ExecutorFunctionReturn> {
  log.with({ executor: "fillInputFieldExecutor" });

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

    const value = executionContext.getInput(TaskParamName.Value);

    if (!value) {
      log.error(`${TaskParamName.Value} undefined`);
      executionContext.logDb.ERROR(taskId, `${TaskParamName.Value} undefined`);
      return { success: false, errorType: "internal" };
    }

    await executionContext.getPage()?.type(selector, value, { delay: 100 });

    executionContext.logDb.INFO(taskId, "Value entered successfully");

    return { success: true };
  } catch (error) {
    executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    log.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
