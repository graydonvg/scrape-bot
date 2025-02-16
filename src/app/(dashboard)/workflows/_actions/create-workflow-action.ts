"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import {
  createWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/lib/schemas/workflows";

const createWorkflowAction = actionClient
  .metadata({ actionName: "createWorkflowAction" })
  .schema(createWorkflowSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: CreateWorkflowSchemaType;
    }) => {
      try {
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("Unauthenticated");
        }

        const { data, error } = await supabase
          .from("workflows")
          .insert({
            ...formData,
            status: "DRAFT",
            definition: "TODO",
          })
          .select("id");

        if (error) {
          throw new Error("Failed to insert workflow into database");
        }

        redirect(`/workflows/editor/${data[0].id}`);
      } catch (error) {
        throw error;
      }
    },
  );

export default createWorkflowAction;
