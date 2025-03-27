"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import {
  updateWorkflowCronSchema,
  UpdateWorkflowCronSchemaType,
} from "@/lib/schemas/workflows";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { ActionReturn } from "@/lib/types/action";
import { CronExpression, CronExpressionParser } from "cron-parser";

const updateWorkflowCronAction = actionClient
  .metadata({ actionName: "updateWorkflowCronAction" })
  .schema(updateWorkflowCronSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: UpdateWorkflowCronSchemaType;
    }): Promise<ActionReturn> => {
      let log = new Logger();
      log = log.with({ context: "updateWorkflowCronAction" });

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

        let interval: CronExpression | null = null;

        try {
          interval = CronExpressionParser.parse(formData.cron, {
            tz: "UTC",
          });
        } catch (error) {
          if (error instanceof Error) {
            return {
              success: false,
              message: error.message,
            };
          }

          throw error;
        }

        if (!interval) {
          log.error("Interval is missing");
          return {
            success: false,
            message: userErrorMessages.Unexpected,
          };
        }

        const { error } = await supabase
          .from("workflows")
          .update({
            cron: formData.cron,
            nextExecutionAt: interval.next().toDate().toISOString(),
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
          message: "Cron updated",
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

export default updateWorkflowCronAction;
