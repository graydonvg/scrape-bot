"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { ActionReturn } from "@/lib/types/action";
import { userAccountSchema, UserAccountSchemaType } from "@/lib/schemas/user";

const updateUserAccountDetailsAction = actionClient
  .metadata({ actionName: "updateUserAccountDetailsAction" })
  .schema(userAccountSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: UserAccountSchemaType;
    }): Promise<ActionReturn<keyof UserAccountSchemaType>> => {
      let log = new Logger().with({
        context: "updateUserAccountDetailsAction",
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

        const { error: updateUserError } = await supabase
          .from("users")
          .update({})
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

        // const { data: passwordVerificationSuccess } = await supabase.rpc('verifyUserPassword', {
        // 	password: passwordData.currentPassword,
        // });

        // if (!passwordVerificationSuccess) {
        // 	const message = 'Incorrect current password';

        // 	log.warn(message);

        // 	return NextResponse.json(
        // 		{
        // 			success: false,
        // 			message,
        // 		},
        // 		{ status: 400 }
        // 	);
        // }

        // const { error: updateError } = await supabase.auth.updateUser({ password: passwordData.newPassword });

        revalidatePath("/");
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

export default updateUserAccountDetailsAction;
