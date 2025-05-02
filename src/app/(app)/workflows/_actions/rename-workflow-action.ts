"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { actionClient } from "@/lib/safe-action";
import {
  renameWorkflowSchema,
  RenameWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ActionReturn } from "@/lib/types/action";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { redirect } from "next/navigation";

const renameWorkflowAction = actionClient
  .metadata({ actionName: "renameWorkflowAction" })
  .schema(renameWorkflowSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: RenameWorkflowSchemaType;
    }): Promise<ActionReturn<keyof RenameWorkflowSchemaType>> => {
      let log = new Logger().with({ context: "renameWorkflowAction" });

      try {
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          log.warn(loggerErrorMessages.Unauthorized, { formData });
          redirect("signin");
        }

        log = log.with({ userId: user.id });

        const { error } = await supabase
          .from("workflows")
          .update({
            name: formData.name,
            description: formData.description ? formData.description : null,
          })
          .eq("userId", user.id)
          .eq("workflowId", formData.workflowId);

        if (error) {
          if (error.message.includes('constraint "user_workflow_name_unique"'))
            return {
              success: false,
              field: "name",
              type: "duplicate",
              message: `Workflow name "${formData.name}" already exists. Please provide a unique name.`,
            };

          log.error(loggerErrorMessages.Insert, {
            error,
            formData,
          });
          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        revalidatePath("/workflows");
        return {
          success: true,
          message: "Workflow renamed",
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

export default renameWorkflowAction;
