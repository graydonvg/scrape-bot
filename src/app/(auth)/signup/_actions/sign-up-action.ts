"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import { signUpSchema, SignUpSchemaType } from "@/lib/schemas/auth";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { ActionReturn } from "@/lib/types/action";

const signUpAction = actionClient
  .metadata({ actionName: "signUpAction" })
  .schema(signUpSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: SignUpSchemaType;
    }): Promise<ActionReturn<Array<keyof SignUpSchemaType>>> => {
      const log = new Logger().with({ context: "signUpAction" });

      try {
        const supabase = await createSupabaseServerClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          log.warn("Failed to sign up. A user session already exists.", user);
          return {
            success: false,
            message: "Unable to sign up",
          };
        }

        if (formData.password !== formData.confirmPassword) {
          log.warn("Passwords do not match");
          return {
            success: false,
            field: ["password", "confirmPassword"],
            type: "validate",
            message: "Passwords do not match",
          };
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, firstName, lastName, ...authData } = formData;

        const { error } = await supabase.auth.signUp({
          ...authData,
          options: {
            data: {
              first_name: firstName?.length ? firstName : null,
              last_name: lastName?.length ? lastName : null,
            },
          },
        });

        if (error) {
          log.error("Signup error", {
            error,
          });

          if (error.code === "user_already_exists") {
            return {
              success: false,
              message: "Unable to sign up",
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

export default signUpAction;
