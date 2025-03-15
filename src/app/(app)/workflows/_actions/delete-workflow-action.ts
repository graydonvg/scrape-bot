"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { actionClient } from "@/lib/safe-action";
import {
  deleteWorkflowSchema,
  DeleteWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import { ActionReturn } from "@/lib/types/action";
import { Logger } from "next-axiom";
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const deleteWorkflowAction = actionClient
  .metadata({ actionName: "deleteWorkflowAction" })
  .schema(deleteWorkflowSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: DeleteWorkflowSchemaType;
    }): Promise<ActionReturn> => {
      let log = new Logger();
      log = log.with({ context: "deleteWorkflowAction" });

      try {
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          log.warn(LOGGER_ERROR_MESSAGES.Unauthorized, { formData });
          redirect("signin");
        }

        log = log.with({ userId: user.id });

        const { error } = await supabase
          .from("workflows")
          .delete()
          .eq("workflowId", formData.workflowId)
          .eq("userId", user.id);

        if (error) {
          log.error(LOGGER_ERROR_MESSAGES.Delete, {
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
          message: "Workflow deleted",
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

export default deleteWorkflowAction;
