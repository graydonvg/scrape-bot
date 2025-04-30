"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import { signInSchema, SignInSchemaType } from "@/lib/schemas/auth";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { ActionReturn } from "@/lib/types/action";

const signInWithPasswordAction = actionClient
  .metadata({ actionName: "signInWithPasswordAction" })
  .schema(signInSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: SignInSchemaType;
    }): Promise<ActionReturn> => {
      let log = new Logger();
      log = log.with({ context: "signInWithPasswordAction" });

      try {
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          log.warn("Failed to sign in. A user session already exists.", user);
          return {
            success: false,
            message: "Unable to sign in",
          };
        }

        const { error } = await supabase.auth.signInWithPassword(formData);

        if (error) {
          log.error("Signin error", {
            error,
          });

          if (error.code === "invalid_credentials") {
            return {
              success: false,
              message: "Unable to sign in",
            };
          }

          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }
      } catch (error) {
        log.error(loggerErrorMessages.Unexpected, { error });
        return {
          success: false,
          message: userErrorMessages.Unexpected,
        };
      }

      redirect("/dashboard");
    },
  );

export default signInWithPasswordAction;
