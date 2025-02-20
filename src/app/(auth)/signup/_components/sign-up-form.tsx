"use client";

import { Button } from "@/components/ui/button";
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
import signUpAction from "../_actions/sign-up-action";

export function SignUpForm() {
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });
  const { execute, isPending } = useAction(signUpAction, {
    onError: () => {
      toast.error("Failed to sign up");
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(execute)} className="space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">
            New to ScrapeBot? <span className="font-light">Sign up</span>
          </h1>
        </div>
        <div className="space-y-6">
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
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            loading={isPending}
            className="w-full capitalize"
          >
            Sign up
          </Button>
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
}
