import "server-only";

import puppeteer from "puppeteer";
import { goToWebsiteTask } from "../tasks/entry-point";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { Logger } from "next-axiom";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";

export default async function goToWebsiteExecutor(
  taskId: string,
  executionContext: ExecutionContext<typeof goToWebsiteTask>,
  log: Logger,
): Promise<ExecutorFunctionReturn> {
  log.with({ executor: "goToWebsiteExecutor" });

  try {
    const websiteUrl = executionContext.getInput(TaskParamName.WebsiteUrl);

    const browser = await puppeteer.launch({
      headless: true, // false to open the browser window for testing
    });

    executionContext.logDb.INFO(taskId, "Browser launched successfully");

    executionContext.setBrowser(browser);

    const page = await browser.newPage();
    await page.goto(websiteUrl);

    executionContext.logDb.INFO(taskId, `Visiting ${websiteUrl}`);

    executionContext.setPage(page);

    return { success: true };
  } catch (error) {
    executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    log.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
