"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import {
  deleteCredentialSchema,
  DeleteCredentialSchemaType,
} from "@/lib/schemas/credential";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { ActionReturn } from "@/lib/types/action";

const deleteCredentialAction = actionClient
  .metadata({ actionName: "deleteCredentialAction" })
  .schema(deleteCredentialSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: DeleteCredentialSchemaType;
    }): Promise<ActionReturn<keyof DeleteCredentialSchemaType>> => {
      let log = new Logger().with({ context: "deleteCredentialAction" });

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

        const { error } = await supabase
          .from("credentials")
          .delete()
          .eq("userId", user.id)
          .eq("credentialId", formData.credentialId);

        if (error) {
          log.error(loggerErrorMessages.Delete, {
            error,
            formData,
          });
          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        revalidatePath("/credentials");
        return {
          success: true,
          message: "Credential deleted",
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

export default deleteCredentialAction;
