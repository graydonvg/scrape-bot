import "server-only";

import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";
import { addPropertyToJsonTask } from "../tasks/data-insertion";

export default async function addPropertyToJsonExecutor(
  executionContext: ExecutionContext<typeof addPropertyToJsonTask>,
): Promise<ExecutorFunctionReturn> {
  const logger = executionContext.logger.with({
    executor: "addPropertyToJsonExecutor",
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

    const propertyValue = executionContext.getInput(
      TaskParamName.PropertyValue,
    );

    if (!propertyValue) {
      logger.error(`${TaskParamName.PropertyValue} undefined`);
      executionContext.logDb.ERROR(
        taskId,
        `${TaskParamName.PropertyValue} undefined`,
      );
      return { success: false, errorType: "internal" };
    }

    const json = JSON.parse(jsonData);
    json[propertyName] = propertyValue;

    executionContext.logDb.INFO(taskId, "Property added to JSON");

    executionContext.setOutput(TaskParamName.UpdatedJson, JSON.stringify(json));

    return { success: true };
  } catch (error) {
    if (taskId) {
      executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    }

    logger.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
