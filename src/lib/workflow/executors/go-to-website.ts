import "server-only";

import puppeteer from "puppeteer";
import { goToWebsiteTask } from "../tasks/entry-point";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";

export default async function goToWebsiteExecutor(
  executionContext: ExecutionContext<typeof goToWebsiteTask>,
): Promise<ExecutorFunctionReturn> {
  const logger = executionContext.logger.with({
    executor: "goToWebsiteExecutor",
  });

  let taskId: string | null = null;

  try {
    taskId = executionContext.getTaskId();

    if (!taskId) logger.error("Task ID undefined");

    const websiteUrl = executionContext.getInput(TaskParamName.WebsiteUrl);

    const browser = await puppeteer.launch({
      headless: false, // false to open the browser window for testing
    });

    executionContext.logDb.INFO(taskId, "Browser launched successfully");

    executionContext.setBrowser(browser);

    const page = await browser.newPage();
    await page.goto(websiteUrl);

    executionContext.logDb.INFO(taskId, `Visiting ${websiteUrl}`);

    executionContext.setPage(page);

    return { success: true };
  } catch (error) {
    if (taskId) {
      executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    }

    logger.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
