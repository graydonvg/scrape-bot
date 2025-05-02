"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import {
  removeWorkflowScheduleSchema,
  RemoveWorkflowScheduleSchemaType,
} from "@/lib/schemas/workflows";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { ActionReturn } from "@/lib/types/action";

const removeWorkflowScheduleAction = actionClient
  .metadata({ actionName: "removeWorkflowScheduleAction" })
  .schema(removeWorkflowScheduleSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: RemoveWorkflowScheduleSchemaType;
    }): Promise<ActionReturn> => {
      let log = new Logger().with({ context: "removeWorkflowScheduleAction" });

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
          .from("workflows")
          .update({
            cron: null,
            nextExecutionAt: null,
          })
          .eq("userId", user.id)
          .eq("workflowId", formData.workflowId);

        if (error) {
          log.error(loggerErrorMessages.Update, {
            error,
            formData,
          });
          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        revalidatePath("/workflows");
        return {
          success: true,
          message: "Workflow schedule removed",
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

export default removeWorkflowScheduleAction;
