"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { actionClient } from "@/lib/safe-action";
import {
  publishWorkflowSchema,
  PublishWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import buildWorkflowExecutionPlan from "@/lib/workflow/helpers/build-workflow-execution-plan";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { ActionReturn } from "@/lib/types/action";
import { calculateTotalCreditCostFromNodes } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const publishWorkflowAction = actionClient
  .metadata({ actionName: "publishWorkflowAction" })
  .schema(publishWorkflowSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: PublishWorkflowSchemaType;
    }): Promise<ActionReturn> => {
      let log = new Logger().with({ context: "publishWorkflowAction" });

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

        const workflowId = formData.workflowId;
        const workflowDefinition = JSON.parse(formData.definition);
        const { nodes, edges } = workflowDefinition;
        const result = buildWorkflowExecutionPlan(nodes, edges);

        if (result.error) {
          log.error("Workflow definition is invalid", { error: result.error });
          return {
            success: false,
            message: "Workflow definition is invalid",
          };
        }

        if (!result.executionPlan) {
          log.error("No execution plan generated");
          return {
            success: false,
            message: "No execution plan generated",
          };
        }

        const executionPlan = result.executionPlan;
        const totalCreditCost = calculateTotalCreditCostFromNodes(nodes);

        const { error } = await supabase
          .from("workflows")
          .update({
            definition: formData.definition,
            executionPlan: JSON.stringify(executionPlan),
            creditCost: totalCreditCost,
            status: "PUBLISHED",
          })
          .eq("userId", user.id)
          .eq("workflowId", formData.workflowId)
          .eq("status", "DRAFT");

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

        revalidatePath(`/workflows/workflow/${workflowId}/editor`);
        return {
          success: true,
          message: "Workflow published",
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

export default publishWorkflowAction;
