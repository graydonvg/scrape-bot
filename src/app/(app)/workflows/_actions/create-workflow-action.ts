"use server";

import createSupabaseServerClient from "@/lib/supabase/supabase-server";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import {
  createWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Logger } from "next-axiom";
import { loggerErrorMessages, userErrorMessages } from "@/lib/constants";
import { Edge } from "@xyflow/react";
import createWorkflowNode from "@/lib/workflow/helpers/create-workflow-node";
import { ActionReturn } from "@/lib/types/action";
import { TaskType } from "@/lib/types/task";
import { WorkflowNode } from "@/lib/types/workflow";

const createWorkflowAction = actionClient
  .metadata({ actionName: "createWorkflowAction" })
  .schema(createWorkflowSchema)
  .action(
    async ({
      parsedInput: formData,
    }: {
      parsedInput: CreateWorkflowSchemaType;
    }): Promise<ActionReturn<keyof CreateWorkflowSchemaType>> => {
      let log = new Logger().with({ context: "createWorkflowAction" });

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

        const initialWorkflow: { nodes: WorkflowNode[]; edges: Edge[] } = {
          nodes: [],
          edges: [],
        };

        initialWorkflow.nodes.push(createWorkflowNode(TaskType.GoToWebiste));

        const { data, error } = await supabase
          .from("workflows")
          .insert({
            ...formData,
            name: formData.name,
            description: formData.description ? formData.description : null,
            definition: JSON.stringify(initialWorkflow),
          })
          .select("workflowId");

        if (error) {
          if (error.message.includes('constraint "user_workflow_name_unique"'))
            return {
              success: false,
              field: "name",
              type: "duplicate",
              message: `Workflow name "${formData.name}" already exists. Please provide a unique name.`,
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

        revalidatePath("/workflows");
        redirect(`/workflows/workflow/${data[0].workflowId}/editor`);
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

export default createWorkflowAction;
