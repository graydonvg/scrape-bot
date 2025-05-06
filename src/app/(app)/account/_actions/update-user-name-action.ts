"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { ActionReturn } from "@/lib/types/action";
import { userNameSchema, UserNameSchemaType } from "@/lib/schemas/user";

const updateUserNameAction = actionClient
  .metadata({ actionName: "updateUserNameAction" })
  .schema(userNameSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: UserNameSchemaType;
    }): Promise<ActionReturn> => {
      let log = new Logger().with({
        context: "updateUserNameAction",
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

        const firstName =
          formData.firstName && formData.firstName.length > 0
            ? formData.firstName
            : null;
        const lastName =
          formData.lastName && formData.lastName.length > 0
            ? formData.lastName
            : null;

        const { error: updateUserError } = await supabase
          .from("users")
          .update({
            firstName,
            lastName,
          })
          .eq("userId", user.id);

        if (updateUserError) {
          log.error(loggerErrorMessages.Update, {
            error: updateUserError,
            formData,
          });

          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        revalidatePath("/");
        return {
          success: true,
          message: "Name updated sucessfully",
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

export default updateUserNameAction;
