"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signUpSchema, SignUpSchemaType } from "@/lib/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { userErrorMessages } from "@/lib/constants";
import signUpAction from "./_actions/sign-up-action";
import { useEffect } from "react";
import CustomFormLabel from "@/components/custom-form-label";
import ButtonWithSpinner from "@/components/button-with-spinner";
import { ActionReturn } from "@/lib/types/action";

const TOAST_ID = "sign-up";

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignUpPage() {
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues,
  });
  const { execute, isPending } = useAction(signUpAction, {
    onExecute: () => toast.loading("Signing up...", { id: TOAST_ID }),
    onSuccess: ({ data }) => handleSuccess(data),
    onError: ({ error: { validationErrors } }) => handleError(validationErrors),
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  useEffect(() => {
    if (password && confirmPassword && password === confirmPassword) {
      form.clearErrors(["password", "confirmPassword"]);
    }
  }, [password, confirmPassword, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(execute)} className="space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">
            New to ScrapeBot? <span className="font-light">Sign up</span>
          </h1>
          <p className="text-muted-foreground text-sm text-pretty">
            Enter your email address and password to create a new account
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <CustomFormLabel label="First Name" optional />
                  <FormControl>
                    <Input placeholder="Your first name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <CustomFormLabel label="Last Name" optional />
                  <FormControl>
                    <Input placeholder="Your last name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Your password..."
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
                    placeholder="Your password..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ButtonWithSpinner
            type="submit"
            loading={isPending}
            className="mt-2 w-full capitalize"
          >
            Sign up
          </ButtonWithSpinner>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );

  function handleSuccess(data?: ActionReturn<Array<keyof SignUpSchemaType>>) {
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
              shouldFocus: field === "password" ? true : false,
            },
          ),
        );

        return toast.error(userErrorMessages.GenericFormValidation, {
          id: TOAST_ID,
        });
      }

      return toast.error(data.message, { id: TOAST_ID });
    }

    toast.dismiss(TOAST_ID);
  }

  function handleError(validationErrors?: {
    formErrors: string[];
    fieldErrors: {
      firstName?: string[] | undefined;
      lastName?: string[] | undefined;
      email?: string[] | undefined;
      password?: string[] | undefined;
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
