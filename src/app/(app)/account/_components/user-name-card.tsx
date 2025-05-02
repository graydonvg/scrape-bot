"use client";

import { UserDb } from "@/lib/types/user";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userNameSchema, UserNameSchemaType } from "@/lib/schemas/user";
import CustomFormLabel from "@/components/custom-form-label";
import ButtonWithSpinner from "@/components/button-with-spinner";
import { SaveIcon } from "lucide-react";

type Props = {
  user: UserDb;
};

export default function UserNameCard({ user }: Props) {
  const form = useForm<UserNameSchemaType>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
    },
  });
  // const { execute, isPending } = useAction(updateUserAccountDetailsAction, {
  //   onExecute: () => toast.loading("Saving changes...", { id: user.email }),
  //   onSuccess: ({ data }) => handleSuccess(data),
  //   onError: ({ error: { validationErrors } }) => handleError(validationErrors),
  // });
  const allFields = form.watch(); // watch all fields
  const fieldHasValue = Object.values(allFields).some(
    (value) => value !== undefined && value !== "",
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-lg font-semibold">User Name</h2>
        </CardTitle>
        <CardDescription>
          <p>
            Please provide your full name to help us keep your account
            information accurate and up to date.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* <form onSubmit={form.handleSubmit(execute)}> */}
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-between gap-6 border-t py-3">
        <p className="text-muted-foreground text-sm text-pretty">
          Please use 32 characters at maximum per field.
        </p>
        <ButtonWithSpinner disabled={!fieldHasValue} startIcon={<SaveIcon />}>
          Save
        </ButtonWithSpinner>
      </CardFooter>
    </Card>
  );
}
