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
  CreateWorkflowSchemaType,
  duplicateWorkflowSchema,
  DuplicateWorkflowSchemaType,
} from "@/lib/schemas/workflows";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { userErrorMessages } from "@/lib/constants";
import useWorkflowsStore from "@/lib/store/workflows-store";
import CustomFormLabel from "@/components/custom-form-label";
import ButtonWithSpinner from "@/components/button-with-spinner";
import { ActionReturn } from "@/lib/types/action";
import duplicateWorkflowAction from "../_actions/duplicate-workflow-action";

const TOAST_ID = "duplicate-workflow";

type Props = {
  setOpen: (open: boolean) => void;
  workflowId: string;
  workflowName: string;
  workflowDescription: string | null;
};

export default function DuplicateWorkflowForm({
  setOpen,
  workflowId,
  workflowName,
  workflowDescription,
}: Props) {
  const { existingWorkflowNames } = useWorkflowsStore();
  const form = useForm<DuplicateWorkflowSchemaType>({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: {
      workflowId,
      name: `${workflowName} copy`,
      description: workflowDescription ? workflowDescription : undefined,
    },
  });
  const { execute, isPending } = useAction(duplicateWorkflowAction, {
    onExecute: () => toast.loading("Duplicating workflow...", { id: TOAST_ID }),
    onSuccess: ({ data }) => handleSuccess(data),
    onError: ({ error: { validationErrors } }) => handleError(validationErrors),
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
          Proceed
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

    execute({ ...formData, workflowId });
  }

  function handleSuccess(
    data?: ActionReturn<keyof DuplicateWorkflowSchemaType>,
  ) {
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
        return toast.error(userErrorMessages.GenericFormValidation, {
          id: TOAST_ID,
        });
      }

      return toast.error(data.message, { id: TOAST_ID });
    }

    setOpen(false);
    toast.success("Workflow duplicated", { id: TOAST_ID });
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
              userErrorMessages.GenericFormValidation,
          },
          { shouldFocus: true },
        );
      });

      return toast.error(userErrorMessages.GenericFormValidation, {
        id: TOAST_ID,
      });
    }

    toast.error(userErrorMessages.Unexpected, { id: TOAST_ID });
  }
}
