"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import { signInSchema, SignInSchemaType } from "@/lib/schemas/auth";

const signInAction = actionClient
  .metadata({ actionName: "signInAction" })
  .schema(signInSchema)
  .action(
    async ({ parsedInput: formData }: { parsedInput: SignInSchemaType }) => {
      try {
        const supabase = await createSupabaseServerClient();

        const { error } = await supabase.auth.signInWithPassword(formData);

        if (error) {
          throw new Error("Failed to sign in");
        }

        redirect("/");
      } catch (error) {
        throw error;
      }
    },
  );

export default signInAction;
