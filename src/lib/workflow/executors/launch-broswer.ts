import { ExecutionContext, WorkflowTaskParamName } from "@/lib/types";
import { wait } from "@/lib/utils";
import puppeteer from "puppeteer";
import { launchBrowserTask } from "../tasks/entry-point";
import { Logger } from "next-axiom";
import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";

export default async function launchBrowserExecutor(
  taskId: string,
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

    log.info(websiteUrl);

    const browser = await puppeteer.launch({
      headless: false, // open the browser window for testing
    });

    await wait(3000);
    await browser.close();
    return { taskId, success: true };
  } catch (error) {
    log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
    return { taskId, success: false };
  }
}
