import { ExecutionContext, WorkflowTaskParamName } from "@/lib/types";
import puppeteer from "puppeteer";
import { launchBrowserTask } from "../tasks/entry-point";
import { Logger } from "next-axiom";
import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";

export default async function launchBrowserExecutor(
  taskId: string,
  nodeId: string,
  executionContext: ExecutionContext<typeof launchBrowserTask>,
) {
  let log = new Logger();
  log = log.with({
    context: "launchBrowserExecutor",
  });

  try {
    const websiteUrl = executionContext.getInput(
      WorkflowTaskParamName.WebsiteUrl,
    );

    const browser = await puppeteer.launch({
      headless: false, // false to open the browser window for testing
    });

    executionContext.setBrowser(browser);

    const page = await browser.newPage();
    await page.goto(websiteUrl);

    executionContext.setPage(page);

    return { taskId, nodeId, success: true };
  } catch (error) {
    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return { taskId, nodeId, success: false };
  }
}
