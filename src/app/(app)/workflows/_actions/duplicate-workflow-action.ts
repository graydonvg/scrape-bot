"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import {
  duplicateWorkflowSchema,
  DuplicateWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { ActionReturn } from "@/lib/types/action";

const duplicateWorkflowAction = actionClient
  .metadata({ actionName: "duplicateWorkflowAction" })
  .schema(duplicateWorkflowSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: DuplicateWorkflowSchemaType;
    }): Promise<ActionReturn<keyof DuplicateWorkflowSchemaType>> => {
      let log = new Logger();
      log = log.with({ context: "duplicateWorkflowAction" });

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

        const { data: sourceData, error: sourceError } = await supabase
          .from("workflows")
          .select("definition")
          .eq("workflowId", formData.workflowId);

        if (sourceError) {
          log.error(loggerErrorMessages.Select, {
            error: sourceError,
            formData,
          });
          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        const { error } = await supabase
          .from("workflows")
          .insert({
            name: formData.name,
            description: formData.description ? formData.description : null,
            definition: sourceData[0].definition,
          })
          .select("workflowId");

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
          message: "Workflow duplicated",
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

export default duplicateWorkflowAction;
