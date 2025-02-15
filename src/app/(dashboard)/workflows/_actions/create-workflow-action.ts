// "use server";

// import createSupabaseServerClient from "@/lib/supabase/supabase-server";
// import {
//   createWorkflowSchema,
//   CreateWorkflowSchemaType,
// } from "@/schemas/workflows";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

// export default async function createWorkflowAction(
//   formData: CreateWorkflowSchemaType,
// ) {
//   const supabase = await createSupabaseServerClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     throw new Error("Unauthenticated");
//   }

//   const parsedFormData = createWorkflowSchema.safeParse(formData);

//   if (!parsedFormData.success) {
//     throw new Error("Invalid form data");
//   }

//   const { data, error } = await supabase
//     .from("workflows")
//     .insert({
//       ...parsedFormData.data,
//       status: "DRAFT",
//       definition: "TODO",
//     })
//     .select("id");

//   if (error) {
//     throw new Error("Failed to create workflow");
//   }

//   revalidatePath("/", "layout");
//   redirect(`/workflows/editor/${data[0].id}`);
// }

"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { signInSchema } from "@/schemas/auth";
import {
  createWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/schemas/workflows";

const createWorkflowAction = actionClient
  .metadata({ actionName: "createWorkflowAction" })
  .schema(createWorkflowSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: CreateWorkflowSchemaType;
    }) => {
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
        throw new Error("Failed to create workflow");
      }

      redirect(`/workflows/editor/${data[0].id}`);
    },
  );

export default createWorkflowAction;
