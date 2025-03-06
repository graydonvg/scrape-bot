import { Logger } from "next-axiom";
import { LOGGER_ERROR_MESSAGES } from "@/lib/constants";

export default async function extractTextFromElementExecutor(taskId: string) {
  let log = new Logger();
  log = log.with({
    context: "extractTextFromElementExecutor",
  });

  return { taskId, success: true };
}
