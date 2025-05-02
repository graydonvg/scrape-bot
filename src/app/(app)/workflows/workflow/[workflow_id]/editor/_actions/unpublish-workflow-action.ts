"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { actionClient } from "@/lib/safe-action";
import {
  unpublishWorkflowSchema,
  UnpublishWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { ActionReturn } from "@/lib/types/action";
import { revalidatePath } from "next/cache";

const unpublishWorkflowAction = actionClient
  .metadata({ actionName: "unpublishWorkflowAction" })
  .schema(unpublishWorkflowSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: UnpublishWorkflowSchemaType;
    }): Promise<ActionReturn> => {
      let log = new Logger().with({ context: "unpublishWorkflowAction" });

      try {
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          log.warn(loggerErrorMessages.Unauthorized, { formData });
          redirect("/signin");
        }

        log = log.with({ userId: user.id });

        const workflowId = formData.workflowId;

        const { error } = await supabase
          .from("workflows")
          .update({
            status: "DRAFT",
            executionPlan: null,
            creditCost: 0,
            cron: null,
            nextExecutionAt: null,
          })
          .eq("userId", user.id)
          .eq("workflowId", formData.workflowId)
          .eq("status", "PUBLISHED");

        if (error) {
          log.error(loggerErrorMessages.Update, {
            error,
            formData,
          });
          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        revalidatePath(`/workflows/workflow/${workflowId}/editor`);
        return {
          success: true,
          message: "Workflow unpublished",
        };
      } catch (error) {
        // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
        // Throw the “error” to trigger the redirection
        if (isRedirectError(error)) throw error;

        log.error(loggerErrorMessages.Unexpected, { error });
        return {
          success: false,
          message: userErrorMessages.Unexpected,
        };
      }
    },
  );

export default unpublishWorkflowAction;
