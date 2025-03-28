import "server-only";

import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { getPageHtmlTask } from "../tasks/data-extraction";
import { Logger } from "next-axiom";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";

export default async function getPageHtmlExecutor(
  taskId: string,
  executionContext: ExecutionContext<typeof getPageHtmlTask>,
  log: Logger,
): Promise<ExecutorFunctionReturn> {
  log.with({ executor: "getPageHtmlExecutor" });

  try {
    const html = await executionContext.getPage()?.content();

    if (!html) {
      log.error("HTML undefined");
      executionContext.logDb.ERROR(taskId, "Failed to extract HTML from page");
      return { success: false, errorType: "internal" };
    }

    executionContext.logDb.INFO(taskId, "HTML extracted successfully");

    executionContext.setOutput(TaskParamName.Html, html);

    return { success: true };
  } catch (error) {
    executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    log.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
