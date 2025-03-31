import "server-only";

import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import {
  ExecutionContext,
  ExecutorFunctionReturn,
} from "@/lib/types/execution";
import { TaskParamName } from "@/lib/types/task";
import { extractDataWithAiTask } from "../tasks/data-extraction";
import createSupabaseService from "@/lib/supabase/supabase-service";
import { symmetricDecrypt } from "@/lib/encryption";
// import OpenAI from "openai";

export default async function extractDataWithAiExecutor(
  executionContext: ExecutionContext<typeof extractDataWithAiTask>,
): Promise<ExecutorFunctionReturn> {
  const logger = executionContext.logger.with({
    executor: "extractDataWithAiExecutor",
  });

  let taskId: string | null = null;

  try {
    const userId = executionContext.getUserId();

    if (!userId) throw new Error("User ID undefined");

    taskId = executionContext.getTaskId();

    if (!taskId) logger.error("Task ID undefined");

    const content = executionContext.getInput(TaskParamName.Content);

    if (!content) {
      logger.error(`${TaskParamName.Content} undefined`);
      executionContext.logDb.ERROR(
        taskId,
        `${TaskParamName.Content} undefined`,
      );
      return { success: false, errorType: "internal" };
    }

    const credentials = executionContext.getInput(TaskParamName.Credential);

    if (!credentials) {
      logger.error(`${TaskParamName.Credential} undefined`);
      executionContext.logDb.ERROR(
        taskId,
        `${TaskParamName.Credential} undefined`,
      );
      return { success: false, errorType: "internal" };
    }

    const prompt = executionContext.getInput(TaskParamName.Prompt);

    if (!prompt) {
      logger.error(`${TaskParamName.Prompt} undefined`);
      executionContext.logDb.ERROR(taskId, `${TaskParamName.Prompt} undefined`);
      return { success: false, errorType: "internal" };
    }

    const supabase = createSupabaseService();

    const { data, error } = await supabase
      .from("credentials")
      .select("value")
      .eq("userId", userId)
      .eq("credentialId", credentials);

    if (error) {
      logger.error(loggerErrorMessages.Select, { error });
      executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
      return { success: false, errorType: "internal" };
    }

    const plainCredentialValue = symmetricDecrypt(data[0].value);

    if (!plainCredentialValue) {
      logger.error("Failed to decrypt credential");
      executionContext.logDb.ERROR(taskId, "Failed to decrypt credential");
      return { success: false, errorType: "internal" };
    }

    // const openai = new OpenAI({
    //   apiKey: plainCredentialValue,
    // });

    // const response = await openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You are a web scraping assistant that extracts data from HTML or text content. You will receive raw HTML or text as input, along with a prompt specifying what to extract. Your response must be only the extracted data in a valid JSON array or object—without any additional text, explanations, or formatting. Analyze the input carefully and extract data precisely according to the prompt. If no relevant data is found, return an empty JSON array (`[]`). Do not infer missing data, generate additional content, or respond with any text outside of JSON format. Work strictly within the provided content.",
    //     },
    //     { role: "user", content: content },
    //     { role: "user", content: prompt },
    //   ],
    //   temperature: 1,
    // });

    // executionContext.logDb.INFO(
    //   taskId,
    //   `Prompt tokens: ${response.usage?.prompt_tokens}`,
    // );
    // executionContext.logDb.INFO(
    //   taskId,
    //   `Completion tokens: ${response.usage?.completion_tokens}`,
    // );

    // const result = response.choices[0].message.content;

    // if (!result) {
    //   executionContext.logDb.ERROR(taskId, "No response from AI");
    //   return { success: false, errorType: "internal" };
    // }

    const mockExtractedData = {
      userNameSelector: "#username",
      passwordSelector: "#password",
      loginButtonSelector: "body > div > form > input.btn.btn-primary",
    };

    executionContext.setOutput(
      TaskParamName.ExtractedData,
      JSON.stringify(mockExtractedData),
    );

    return { success: true };
  } catch (error) {
    if (taskId) {
      executionContext.logDb.ERROR(taskId, userErrorMessages.Unexpected);
    }

    logger.error(loggerErrorMessages.Unexpected, { error });
    return { success: false, errorType: "internal" };
  }
}
