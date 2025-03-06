import { Logger } from "next-axiom";
import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";

export default async function getPageHtmlExecutor(taskId: string) {
  let log = new Logger();
  log = log.with({
    context: "getPageHtmlExecutor",
  });

  return { taskId, success: true };
}
