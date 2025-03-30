"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import {
  addCredentialSchema,
  AddCredentialSchemaType,
} from "@/lib/schemas/credential";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { ActionReturn } from "@/lib/types/action";
import { symmetricEncrypt } from "@/lib/encryption";

const addCredentialAction = actionClient
  .metadata({ actionName: "addCredentialAction" })
  .schema(addCredentialSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: AddCredentialSchemaType;
    }): Promise<ActionReturn<keyof AddCredentialSchemaType>> => {
      let log = new Logger();
      log = log.with({ context: "addCredentialAction" });

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

        const encryptedCredential = symmetricEncrypt(formData.value);

        const { error } = await supabase
          .from("credentials")
          .insert({ name: formData.name, value: encryptedCredential });

        if (error) {
          if (
            error.message.includes('constraint "user_credential_name_unique"')
          )
            return {
              success: false,
              field: "name",
              type: "duplicate",
              message: `Credential name "${formData.name}" already exists. Please provide a unique name.`,
            };

          log.error(loggerErrorMessages.Insert, {
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
          message: "Credential added",
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

export default addCredentialAction;
