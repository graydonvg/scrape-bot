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

type ActionReturn = {
  success: boolean;
  field?: keyof CreateWorkflowSchemaType;
  type?: string;
  message: string;
};

const createWorkflowAction = actionClient
  .metadata({ actionName: "createWorkflowAction" })
  .schema(createWorkflowSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: CreateWorkflowSchemaType;
    }): Promise<ActionReturn> => {
      try {
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user)
          return {
            success: false,
            message: "You need to be signed in to perform this action",
          };

        const { data, error } = await supabase
          .from("workflows")
          .insert({
            ...formData,
            status: "DRAFT",
            definition: "TODO",
          })
          .select("id");

        if (error) {
          if (error.message.includes('constraint "user_workflow_name_unique"'))
            return {
              success: false,
              field: "name",
              type: "duplicate",
              message: `Workflow name "${formData.name}" already exists. Please provide a unique name.`,
            };

          return {
            success: false,
            message: "An unexpected error occurred",
          };
        }

        redirect(`/workflows/editor/${data[0].id}`);
      } catch (error) {
        // When you call the redirect() function (from next/navigation), it throws a special error (with the code NEXT_REDIRECT) to immediately halt further processing and trigger the redirection. This “error” is meant to be caught internally by Next.js, not by the try/catch blocks.
        // Throw the “error” to trigger the redirection
        if (isRedirectError(error)) throw error;

        return {
          success: false,
          message: "An unexpected error occurred",
        };
      } finally {
        revalidatePath("/workflows");
      }
    },
  );

export default createWorkflowAction;
