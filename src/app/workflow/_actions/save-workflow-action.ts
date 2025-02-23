"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { actionClient } from "@/lib/safe-action";
import {
  saveWorkflowSchema,
  SaveWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ActionReturn } from "@/lib/types";
import { Logger } from "next-axiom";
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from "@/lib/constants";

const saveWorkflowAction = actionClient
  .metadata({ actionName: "saveWorkflowAction" })
  .schema(saveWorkflowSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: SaveWorkflowSchemaType;
    }): Promise<ActionReturn> => {
      let log = new Logger();
      log = log.with({ context: "saveWorkflowAction" });

      try {
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          log.warn(LOGGER_ERROR_MESSAGES.Unauthorized, { formData });
          return {
            success: false,
            message: USER_ERROR_MESSAGES.Unauthorized,
          };
        }

        log = log.with({ userId: user.id });

        const { error } = await supabase
          .from("workflows")
          .update({
            definition: formData.definition,
            status: "PUBLISHED",
          })
          .eq("userId", user.id)
          .eq("workflowId", formData.workflowId);

        if (error) {
          log.error(LOGGER_ERROR_MESSAGES.Update, {
            error,
            formData,
          });
          return {
            success: false,
            message: USER_ERROR_MESSAGES.Unexpected,
          };
        }

        revalidatePath("/workflows");
        return {
          success: true,
          message: "Workflow saved",
        };
      } catch (error) {
        // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
        // Throw the “error” to trigger the redirection
        if (isRedirectError(error)) throw error;

        log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
        return {
          success: false,
          message: USER_ERROR_MESSAGES.Unexpected,
        };
      }
    },
  );

export default saveWorkflowAction;
