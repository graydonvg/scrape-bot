import { Logger } from "next-axiom";
import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import { ExecutionContext, WorkflowTaskParamName } from "@/lib/types";
import { getPageHtmlTask } from "../tasks/data-extraction";

export default async function getPageHtmlExecutor(
  taskId: string,
  nodeId: string,
  executionContext: ExecutionContext<typeof getPageHtmlTask>,
) {
  let log = new Logger();
  log = log.with({
    context: "getPageHtmlExecutor",
  });

  try {
    const html = await executionContext.getPage()?.content();

    if (!html) {
      log.error("HTML missing");
      return { taskId, nodeId, success: false };
    }

    executionContext.setOutput(WorkflowTaskParamName.Html, html);

    return { taskId, nodeId, success: true };
  } catch (error) {
    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return { taskId, nodeId, success: false };
  }
}
