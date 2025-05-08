"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { ActionReturn } from "@/lib/types/action";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import createSupabaseService from "@/lib/supabase/supabase-service";
import { actionClient } from "@/lib/safe-action";
import {
  deleteAccountSchema,
  DeleteAccountSchemaType,
} from "@/lib/schemas/user";

const deleteUserAccountAction = actionClient
  .metadata({ actionName: "deleteUserAccountAction" })
  .schema(deleteAccountSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: DeleteAccountSchemaType;
    }): Promise<ActionReturn> => {
      let log = new Logger().with({ context: "deleteUserAccountAction" });

      try {
        const supabaseService = createSupabaseService();
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          log.warn(loggerErrorMessages.Unauthorized);
          redirect("/signin");
        }

        log = log.with({ userId: user.id });

        const { error } = await supabaseService.auth.admin.deleteUser(user.id);

        if (error) {
          log.error("Failed to delete user account", { error });
          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        const avatarFilePath = formData.customAvatarUrl
          ?.split("avatars/")
          .pop();

        if (avatarFilePath) {
          const { error: removeAvatarError } = await supabase.storage
            .from("avatars")
            .remove([avatarFilePath]);

          if (removeAvatarError) {
            log.error("Error removing avatar", { error: removeAvatarError });
          }
        }

        redirect("/");
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

export default deleteUserAccountAction;
