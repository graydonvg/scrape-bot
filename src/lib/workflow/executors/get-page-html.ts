import "server-only";

import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from "@/lib/constants";
import { getPageHtmlTask } from "../tasks/data-extraction";
import { Logger } from "next-axiom";
import { ExecutionContext } from "@/lib/types/execution";
import { WorkflowTaskParamName } from "@/lib/types/workflow";

export default async function getPageHtmlExecutor(
  taskId: string,
  executionContext: ExecutionContext<typeof getPageHtmlTask>,
  log: Logger,
) {
  log.with({ executor: "getPageHtmlExecutor" });

  try {
    const html = await executionContext.getPage()?.content();

    if (!html) {
      log.error("HTML not defined");
      executionContext.logDb.ERROR(taskId, "HTML not defined");
      return { success: false };
    }

    executionContext.setOutput(WorkflowTaskParamName.Html, html);

    return { success: true };
  } catch (error) {
    executionContext.logDb.ERROR(taskId, USER_ERROR_MESSAGES.Unexpected);
    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return { success: false };
  }
}
