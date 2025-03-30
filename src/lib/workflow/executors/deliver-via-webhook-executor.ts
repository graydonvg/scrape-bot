import "server-only";

import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { Logger } from "next-axiom";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";
import { deliverViaWebhookTask } from "../tasks/results";

export default async function deliverViaWebhookExecutor(
  taskId: string,
  executionContext: ExecutionContext<typeof deliverViaWebhookTask>,
  log: Logger,
): Promise<ExecutorFunctionReturn> {
  log.with({ executor: "deliverViaWebhookExecutor" });

  try {
    const targetUrl = executionContext.getInput(TaskParamName.TargetUrl);

    if (!targetUrl) {
      log.error(`${TaskParamName.TargetUrl} undefined`);
      executionContext.logDb.ERROR(
        taskId,
        `${TaskParamName.TargetUrl} undefined`,
      );
      return { success: false, errorType: "internal" };
    }

    const body = executionContext.getInput(TaskParamName.Body);

    if (!body) {
      log.error(`${TaskParamName.Body} undefined`);
      executionContext.logDb.ERROR(taskId, `${TaskParamName.Body} undefined`);
      return { success: false, errorType: "internal" };
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      executionContext.logDb.ERROR(
        taskId,
        `Status: ${response.status} - ${response.statusText}`,
      );
      return { success: false, errorType: "user" };
    }

    const responseBody = await response.json();

    executionContext.logDb.INFO(taskId, JSON.stringify(responseBody, null, 2));

    return { success: true };
  } catch (error) {
    executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    log.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
