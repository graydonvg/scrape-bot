"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { signInSchema } from "@/schemas/auth";

const signInAction = actionClient
  .metadata({ actionName: "signInAction" })
  .schema(signInSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: z.infer<typeof signInSchema>;
    }) => {
      const supabase = await createSupabaseServerClient();

      const { error } = await supabase.auth.signInWithPassword(formData);

      if (error) {
        throw new Error("Failed to sign in");
      }

      redirect("/");
    },
  );

export default signInAction;
