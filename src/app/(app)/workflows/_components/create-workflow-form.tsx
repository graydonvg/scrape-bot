"use client";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  createWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import { Textarea } from "@/components/ui/textarea";
import createWorkflowAction from "../_actions/create-workflow-action";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { USER_ERROR_MESSAGES } from "@/lib/constants";
import useWorkflowsStore from "@/lib/store/workflows-store";
import CustomFormLabel from "@/components/custom-form-label";
import ButtonWithSpinner from "@/components/button-with-spinner";
import { ActionReturn } from "@/lib/types/action";

const initialState = {
  name: "",
  description: "",
};

export default function CreateWorkflowForm() {
  const { existingWorkflowNames } = useWorkflowsStore();
  const toastId = "create-workflow";
  const form = useForm<CreateWorkflowSchemaType>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: initialState,
  });
  const { execute, isPending } = useAction(createWorkflowAction, {
    onExecute: () => {
      toast.loading("Creating workflow...", { id: toastId });
    },
    onSuccess: ({ data }) => {
      handleSuccess(data);
    },
    onError: ({ error: { validationErrors } }) => {
      handleError(validationErrors);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <CustomFormLabel label="Name" optional={false} />
              <FormControl>
                <Input
                  placeholder="Provide a descriptive and unique name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <CustomFormLabel label="Description" optional />
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none"
                  placeholder="Your description..."
                />
              </FormControl>
              <FormDescription>
                Provide a brief description of what your workflow does.
                <br />
                This is optional, but can help you remember the workflow&apos;s
                purpose.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonWithSpinner
          type="submit"
          loading={isPending}
          className="w-full capitalize"
        >
          {!isPending ? "Proceed" : "Creating workflow..."}
        </ButtonWithSpinner>
      </form>
    </Form>
  );

  function handleSubmit(formData: CreateWorkflowSchemaType) {
    const workflowNameExists = existingWorkflowNames?.includes(formData.name);

    if (workflowNameExists) {
      form.setError(
        "name",
        {
          type: "duplicate",
          message: `Workflow name "${formData.name}" already exists. Please provide a unique name.`,
        },
        {
          shouldFocus: true,
        },
      );

      return;
    }

    execute(formData);
  }

  function handleSuccess(data?: ActionReturn<"name" | "description">) {
    if (data && !data.success) {
      if (data.field) {
        form.setError(
          data.field,
          {
            type: data.type,
            message: data.message,
          },
          {
            shouldFocus: true,
          },
        );
        return toast.error(USER_ERROR_MESSAGES.GenericFormValidation, {
          id: toastId,
        });
      }

      return toast.error(data.message, { id: toastId });
    }

    toast.success("Workflow created", { id: toastId });
  }

  function handleError(validationErrors?: {
    formErrors: string[];
    fieldErrors: {
      name?: string[] | undefined;
      description?: string[] | undefined;
    };
  }) {
    if (validationErrors) {
      const keys = Object.keys(validationErrors.fieldErrors) as Array<
        keyof typeof validationErrors.fieldErrors
      >;

      keys.forEach((key) => {
        form.setError(
          key,
          {
            message:
              validationErrors.fieldErrors[key]?.[0] ||
              USER_ERROR_MESSAGES.GenericFormValidation,
          },
          { shouldFocus: true },
        );
      });

      return toast.error(USER_ERROR_MESSAGES.GenericFormValidation, {
        id: toastId,
      });
    }

    toast.error(USER_ERROR_MESSAGES.Unexpected, { id: toastId });
  }
}
