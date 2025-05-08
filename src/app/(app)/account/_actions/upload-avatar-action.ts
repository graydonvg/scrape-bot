"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { ActionReturn } from "@/lib/types/action";
import { userAvatarSchema, UserAvatarSchemaType } from "@/lib/schemas/user";

const uploadAvatarAction = actionClient
  .metadata({ actionName: "uploadAvatarAction" })
  .schema(userAvatarSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: UserAvatarSchemaType;
    }): Promise<ActionReturn> => {
      let log = new Logger().with({
        context: "uploadAvatarAction",
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

        const currentFileExt = formData.currentCustomAvatarUrl
          ?.split("avatars/")
          .pop()
          ?.split(".")
          .pop();
        const newFileExt = formData.avatar.name.split(".").pop();
        const filePath = `user-${user.id}.${newFileExt}`;

        if (currentFileExt && currentFileExt !== newFileExt) {
          // File names include the user id and the file extension.
          // Files with the same name and extension will be replaced.
          // If the user uploads a file with a different extension,
          // delete the old file to prevent storing unused files.
          const { error: removeAvatarError } = await supabase.storage
            .from("avatars")
            .remove([`user-${user.id}.${currentFileExt}`]);

          if (removeAvatarError) {
            log.error("Error removing avatar", { error: removeAvatarError });

            return {
              success: false,
              message: userErrorMessages.Unexpected,
            };
          }
        }

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, formData.avatar, {
            upsert: true,
            contentType: formData.avatar.type,
          });

        if (uploadError) {
          log.error("Error uploading avatar", { error: uploadError });

          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        const { error: updateError } = await supabase
          .from("users")
          .update({ customAvatarUrl: publicUrl })
          .eq("userId", user.id);

        if (updateError) {
          log.error("Error updating custom avatar path", {
            error: updateError,
          });

          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        revalidatePath("/");
        return {
          success: true,
          message: "Avatar uploaded sucessfully",
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

export default uploadAvatarAction;
