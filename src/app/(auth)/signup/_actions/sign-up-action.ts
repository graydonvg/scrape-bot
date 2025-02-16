"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import { signUpSchema, SignUpSchemaType } from "@/lib/schemas/auth";

const signUpAction = actionClient
  .metadata({ actionName: "signUpAction" })
  .schema(signUpSchema)
  .action(
    async ({ parsedInput: formData }: { parsedInput: SignUpSchemaType }) => {
      try {
        const supabase = await createSupabaseServerClient();

        const { error } = await supabase.auth.signUp(formData);

        if (error) {
          throw new Error("Failed to sign up");
        }

        redirect("/");
      } catch (error) {
        throw error;
      }
    },
  );

export default signUpAction;
