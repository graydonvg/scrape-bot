"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userPasswordSchema, UserPasswordSchemaType } from "@/lib/schemas/user";
import ButtonWithSpinner from "@/components/button-with-spinner";
import { SaveIcon } from "lucide-react";
import { toast } from "sonner";
import { ActionReturn } from "@/lib/types/action";
import { useAction } from "next-safe-action/hooks";
import updatePasswordAction from "../_actions/update-password-action";
import { userErrorMessages } from "@/lib/constants";
import { useEffect } from "react";

const TOAST_ID = "update-password";

const defaultValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function PasswordCard() {
  const form = useForm<UserPasswordSchemaType>({
    resolver: zodResolver(userPasswordSchema),
    defaultValues,
  });
  const { execute, isPending } = useAction(updatePasswordAction, {
    onExecute: () => toast.loading("Updating password...", { id: TOAST_ID }),
    onSuccess: ({ data }) => handleSuccess(data),
    onError: ({ error: { validationErrors } }) => handleError(validationErrors),
  });
  const allFields = form.watch(); // watch all fields
  const allFieldsFilled = Object.values(allFields).every(
    (value) => value.length > 5,
  );

  const newPassword = form.watch("newPassword");
  const confirmPassword = form.watch("confirmPassword");

  useEffect(() => {
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      form.clearErrors(["newPassword", "confirmPassword"]);
    }
  }, [newPassword, confirmPassword, form]);

  useEffect(() => {
    // Dismiss the toast if the component unmounts before the upload completes
    return () => {
      toast.dismiss(TOAST_ID);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-lg font-semibold">Change Password</h2>
        </CardTitle>
        <CardDescription>
          <p>
            For your security, you must verify your current password before
            creating a new, strong one.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your current password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your new password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your new password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-between gap-6 border-t py-3">
        <p className="text-muted-foreground text-sm text-pretty">
          Password must be between 6 and 72 characters.
        </p>
        <ButtonWithSpinner
          onClick={form.handleSubmit(execute)}
          loading={isPending}
          disabled={!allFieldsFilled}
          startIcon={<SaveIcon />}
        >
          Submit
        </ButtonWithSpinner>
      </CardFooter>
    </Card>
  );

  function handleSuccess(
    data?: ActionReturn<Array<keyof UserPasswordSchemaType>>,
  ) {
    if (data && !data.success) {
      if (data.field) {
        data.field.forEach((field) =>
          form.setError(
            field,
            {
              type: data.type,
              message: data.message,
            },
            {
              shouldFocus: true,
            },
          ),
        );

        return toast.error(userErrorMessages.GenericFormValidation, {
          id: TOAST_ID,
        });
      }

      return toast.error(data.message, { id: TOAST_ID });
    }

    form.reset();
    toast.success("Password updated", { id: TOAST_ID });
  }

  function handleError(validationErrors?: {
    formErrors: string[];
    fieldErrors: {
      currentPassword?: string[] | undefined;
      newPassword?: string[] | undefined;
      confirmPassword?: string[] | undefined;
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
