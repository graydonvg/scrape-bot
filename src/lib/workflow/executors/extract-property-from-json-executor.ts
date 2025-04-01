import "server-only";

import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";
import { extractPropertyFromJsonTask } from "../tasks/data-extraction";

export default async function extractPropertyFromJsonExecutor(
  executionContext: ExecutionContext<typeof extractPropertyFromJsonTask>,
): Promise<ExecutorFunctionReturn> {
  const logger = executionContext.logger.with({
    executor: "extractPropertyFromJsonExecutor",
  });

  let taskId: string | null = null;

  try {
    taskId = executionContext.getTaskId();

    if (!taskId) logger.error("Task ID undefined");

    const jsonData = executionContext.getInput(TaskParamName.Json);

    if (!jsonData) {
      logger.error(`${TaskParamName.Json} undefined`);
      executionContext.logDb.ERROR(taskId, `${TaskParamName.Json} undefined`);
      return { success: false, errorType: "internal" };
    }

    const propertyName = executionContext.getInput(TaskParamName.PropertyName);

    if (!propertyName) {
      logger.error(`${TaskParamName.PropertyName} undefined`);
      executionContext.logDb.ERROR(
        taskId,
        `${TaskParamName.PropertyName} undefined`,
      );
      return { success: false, errorType: "internal" };
    }

    const json = JSON.parse(jsonData);
    const propertyValue = json[propertyName];

    if (propertyValue === undefined) {
      executionContext.logDb.ERROR(
        taskId,
        `${TaskParamName.PropertyName} "${propertyName}" not found`,
      );
      return { success: false, errorType: "user" };
    }

    executionContext.logDb.INFO(taskId, "Extracted property from JSON");

    executionContext.setOutput(TaskParamName.PropertyValue, propertyValue);

    return { success: true };
  } catch (error) {
    if (taskId) {
      executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    }

    logger.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
