"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { actionClient } from "@/lib/safe-action";
import {
  deleteWorkflowSchema,
  DeleteWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import { revalidatePath } from "next/cache";

const deleteWorkflowAction = actionClient
  .metadata({ actionName: "deleteWorkflowAction" })
  .schema(deleteWorkflowSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: DeleteWorkflowSchemaType;
    }) => {
      try {
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("Unauthenticated");
        }

        const { error } = await supabase
          .from("workflows")
          .delete()
          .eq("id", formData.id)
          .eq("userId", user.id);

        if (error) {
          throw new Error("Failed to delete workflow from database");
        }

        return true;
      } catch (error) {
        throw error;
      } finally {
        revalidatePath("/workflows");
      }
    },
  );

export default deleteWorkflowAction;
