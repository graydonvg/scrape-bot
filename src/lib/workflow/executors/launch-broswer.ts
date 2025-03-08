import "server-only";

import puppeteer from "puppeteer";
import { launchBrowserTask } from "../tasks/entry-point";
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from "@/lib/constants";
import { Logger } from "next-axiom";
import { ExecutionContext } from "@/lib/types/execution";
import { WorkflowTaskParamName } from "@/lib/types/workflow";

export default async function launchBrowserExecutor(
  taskId: string,
  executionContext: ExecutionContext<typeof launchBrowserTask>,
  log: Logger,
) {
  log.with({ executor: "launchBrowserExecutor" });

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

    return { success: true };
  } catch (error) {
    executionContext.logDb.ERROR(taskId, USER_ERROR_MESSAGES.Unexpected);
    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return { success: false };
  }
}
