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
  // const { execute, isPending } = useAction(updateUserAccountDetailsAction, {
  //   onExecute: () => toast.loading("Saving changes...", { id: user.email }),
  //   onSuccess: ({ data }) => handleSuccess(data),
  //   onError: ({ error: { validationErrors } }) => handleError(validationErrors),
  // });
  const allFields = form.watch(); // watch all fields
  const allFieldsFilled = Object.values(allFields).every(
    (value) => value.length > 5,
  );

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
          {/* <form onSubmit={form.handleSubmit(execute)}> */}
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
          Passwords must be at least 6 characters.
        </p>
        <ButtonWithSpinner disabled={!allFieldsFilled} startIcon={<SaveIcon />}>
          Save
        </ButtonWithSpinner>
      </CardFooter>
    </Card>
  );
}
