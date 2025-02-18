"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import {
  createWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ActionReturn } from "@/lib/types";
import { Logger } from "next-axiom";
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from "@/lib/constants";

const createWorkflowAction = actionClient
  .metadata({ actionName: "createWorkflowAction" })
  .schema(createWorkflowSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: CreateWorkflowSchemaType;
    }): Promise<ActionReturn<keyof CreateWorkflowSchemaType>> => {
      let log = new Logger();
      log = log.with({ context: "createWorkflowAction" });

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

        const { data, error } = await supabase
          .from("workflows")
          .insert({
            ...formData,
            status: "DRAFT",
            definition: "TODO",
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

          log.error(LOGGER_ERROR_MESSAGES.Insert, {
            error,
            formData,
          });
          return {
            success: false,
            message: USER_ERROR_MESSAGES.Unexpected,
          };
        }

        redirect(`/workflows/editor/${data[0].workflowId}`);
      } catch (error) {
        // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
        // Throw the “error” to trigger the redirection
        if (isRedirectError(error)) throw error;

        log.error(LOGGER_ERROR_MESSAGES.Unexpected, { error });
        return {
          success: false,
          message: USER_ERROR_MESSAGES.Unexpected,
        };
      } finally {
        revalidatePath("/workflows");
      }
    },
  );

export default createWorkflowAction;
