import "server-only";

import chromium from "@sparticuz/chromium-min";
import puppeteerCore, { Browser as CoreBrowser } from "puppeteer-core";
import puppeteer, { Browser, Page } from "puppeteer";
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

    const page = (await browser.newPage()) as Page;
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
let browser: Browser | CoreBrowser;

async function getBrowser() {
  if (process.env.NODE_ENV === "production") {
    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(remoteExecutablePath),
      headless: chromium.headless,
    });
  } else {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });
  }

  return browser;
}
