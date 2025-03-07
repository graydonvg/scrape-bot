import { Logger } from "next-axiom";
import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";
import { ExecutionContext, WorkflowTaskParamName } from "@/lib/types";
import { extractTextFromElementTask } from "../tasks/data-extraction";
import * as cheerio from "cheerio";

export default async function extractTextFromElementExecutor(
  taskId: string,
  nodeId: string,
  executionContext: ExecutionContext<typeof extractTextFromElementTask>,
) {
  let log = new Logger();
  log = log.with({
    context: "extractTextFromElementExecutor",
  });

  try {
    const selector = executionContext.getInput(WorkflowTaskParamName.Selector);

    if (!selector) {
      log.error("Selector missing");
      return { taskId, nodeId, success: false };
    }

    const html = executionContext.getInput(WorkflowTaskParamName.Html);

    if (!html) {
      log.error("HTML missing");
      return { taskId, nodeId, success: false };
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      log.error("Element not found");
      return { taskId, nodeId, success: false };
    }

    const extractedText = $.text(element);

    if (!extractedText) {
      log.error("Element has no text");
      return { taskId, nodeId, success: false };
    }

    executionContext.setOutput(
      WorkflowTaskParamName.ExtractedText,
      extractedText,
    );

    return { taskId, nodeId, success: true };
  } catch (error) {
    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return { taskId, nodeId, success: false };
  }
}
