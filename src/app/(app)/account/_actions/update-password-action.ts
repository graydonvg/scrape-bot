"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { ActionReturn } from "@/lib/types/action";
import { userPasswordSchema, UserPasswordSchemaType } from "@/lib/schemas/user";

const updatePasswordAction = actionClient
  .metadata({ actionName: "updatePasswordAction" })
  .schema(userPasswordSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: UserPasswordSchemaType;
    }): Promise<ActionReturn<Array<keyof UserPasswordSchemaType>>> => {
      let log = new Logger().with({
        context: "updatePasswordAction",
      });

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

        if (formData.newPassword !== formData.confirmPassword) {
          return {
            success: false,
            field: ["newPassword", "confirmPassword"],
            type: "validate",
            message: "Passwords do not match",
          };
        }

        const {
          data: { session },
          error: signinError,
        } = await supabase.auth.signInWithPassword({
          email: user.email ?? "",
          password: formData.currentPassword,
        });

        if (signinError || !session) {
          if (signinError?.code === "invalid_credentials") {
            return {
              success: false,
              field: ["currentPassword"],
              type: "validate",
              message: "Incorrect current password",
            };
          }

          log.error("Error verifying user password", {
            error: signinError,
            session,
          });
          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        const { error: updatePasswordError } = await supabase.auth.updateUser({
          password: formData.newPassword,
        });

        if (updatePasswordError) {
          log.error("Error updating password", {
            error: updatePasswordError,
          });

          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        return {
          success: true,
          message: "User data updated sucessfully",
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

export default updatePasswordAction;
