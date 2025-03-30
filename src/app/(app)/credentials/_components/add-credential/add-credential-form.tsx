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
  addCredentialSchema,
  AddCredentialSchemaType,
} from "@/lib/schemas/credential";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { userErrorMessages } from "@/lib/constants";
import CustomFormLabel from "@/components/custom-form-label";
import ButtonWithSpinner from "@/components/button-with-spinner";
import { ActionReturn } from "@/lib/types/action";
import { PlusIcon } from "lucide-react";
import addCredentialAction from "../../_actions/add-credential-action";
import { Textarea } from "@/components/ui/textarea";
import useCredentialsStore from "@/lib/store/credentials-store";
import { Dispatch, SetStateAction } from "react";

const TOAST_ID = "create-workflow";

const defaultValues = {
  name: "",
  value: "",
};

type Props = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function AddCredentialForm({ setOpen }: Props) {
  const { existingCredentialNames } = useCredentialsStore();
  const form = useForm<AddCredentialSchemaType>({
    resolver: zodResolver(addCredentialSchema),
    defaultValues,
  });
  const { execute, isPending } = useAction(addCredentialAction, {
    onExecute: () => toast.loading("Adding credential...", { id: TOAST_ID }),
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
                  placeholder="Provide a unique and descriptive name"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This name will be used to identify the credential
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <CustomFormLabel label="Value" optional={false} />
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none"
                  placeholder="Your credential..."
                />
              </FormControl>
              <FormDescription>
                Enter the value associated with this credential.
                <br />
                This value will be securely encrypted and stored.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonWithSpinner
          type="submit"
          loading={isPending}
          className="w-full capitalize"
          startIcon={<PlusIcon />}
        >
          Add
        </ButtonWithSpinner>
      </form>
    </Form>
  );

  function handleSubmit(formData: AddCredentialSchemaType) {
    const credentialNameExists = existingCredentialNames?.includes(
      formData.name,
    );

    if (credentialNameExists) {
      form.setError(
        "name",
        {
          type: "duplicate",
          message: `Credential name "${formData.name}" already exists. Please provide a unique name.`,
        },
        {
          shouldFocus: true,
        },
      );

      return;
    }

    execute(formData);
  }

  function handleSuccess(data?: ActionReturn<keyof AddCredentialSchemaType>) {
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
    toast.success("Credential added", { id: TOAST_ID });
  }

  function handleError(validationErrors?: {
    formErrors: string[];
    fieldErrors: {
      name?: string[] | undefined;
      value?: string[] | undefined;
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
