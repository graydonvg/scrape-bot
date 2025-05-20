import "server-only";

import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
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

    const browser = await getBrowser();
    executionContext.logDb.INFO(taskId, "Browser launched");

    executionContext.setBrowser(browser);

    const page = await browser.newPage();
    await page.goto(websiteUrl, { waitUntil: "networkidle0" });

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

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar";

async function getBrowser() {
  if (process.env.NODE_ENV === "production") {
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(remoteExecutablePath),
      headless: chromium.headless,
    });
  } else {
    return puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });
  }
}
