"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
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
import { signInSchema, SignInSchemaType } from "@/lib/schemas/auth";
import { toast } from "sonner";
import GoogleIcon from "@/components/icons/google-icon";
import { USER_ERROR_MESSAGES } from "@/lib/constants";
import signInWithPasswordAction from "./_actions/sign-in-with-password-action";
import signInWithGoogleAction from "./_actions/sign-in-with-google-action";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import ButtonWithSpinner from "@/components/button-with-spinner";

export default function SignInPage() {
  const toastId = "sign-in";
  const searchParams = useSearchParams();
  const oAuthSuccess = searchParams.get("success");
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const { execute, isPending } = useAction(signInWithPasswordAction, {
    onExecute: () => {
      toast.loading("Signing in...", { id: toastId });
    },
    onSuccess: ({ data }) => {
      if (data && !data.success) {
        return toast.error(data.message, { id: toastId });
      }

      toast.dismiss(toastId);
    },
    onError: ({ error: { validationErrors } }) => {
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
    },
  });

  async function signInWithGoogle() {
    const res = await signInWithGoogleAction();

    if (res && !res.success) {
      toast.error(res.message);
    }
  }

  useEffect(() => {
    if (oAuthSuccess === "false") {
      setTimeout(() => {
        toast.error("An unexpected error occured. Please try again later.");
      }, 100);
    }
  }, [oAuthSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(execute)} className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Sign in to your account</h1>
          <p className="text-muted-foreground text-sm text-pretty">
            Enter your email address and password to sign in to your account
          </p>
        </div>
        <div className="space-y-6">
          <Separator />
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
          <ButtonWithSpinner
            type="submit"
            loading={isPending}
            className="w-full capitalize"
          >
            {!isPending ? "Sign in" : "Signing in..."}
          </ButtonWithSpinner>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
          <Button
            onClick={signInWithGoogle}
            type="button"
            variant="outline"
            className="w-full"
          >
            <GoogleIcon />
            Sign in with Google
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
