"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userAvatarSchema, UserAvatarSchemaType } from "@/lib/schemas/user";
import { UserDb } from "@/lib/types/user";
import { getUserAvatarFallbackChars } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type Props = {
  user: UserDb;
};

export default function AvatarCard({ user }: Props) {
  const form = useForm<UserAvatarSchemaType>({
    resolver: zodResolver(userAvatarSchema),
    // defaultValues: user.avatarUrl ?? undefined,
  });
  // const { execute, isPending } = useAction(updateUserAccountDetailsAction, {
  //   onExecute: () => toast.loading("Saving changes...", { id: user.email }),
  //   onSuccess: ({ data }) => handleSuccess(data),
  //   onError: ({ error: { validationErrors } }) => handleError(validationErrors),
  // });

  const avatarFallbackChars = getUserAvatarFallbackChars(user);
  const avatarFile = form.watch("avatar");
  const avatarPreview = avatarFile
    ? URL.createObjectURL(avatarFile)
    : user.avatarUrl;

  return (
    <Card className="flex items-center justify-between gap-6 p-6">
      <CardHeader className="p-0">
        <CardTitle>
          <h2 className="text-lg font-semibold">Avatar</h2>
        </CardTitle>
        <CardDescription className="flex flex-col">
          <p>This is your avatar.</p>
          <p className="text-pretty">
            Click on the avatar to upload a custom one from your files.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-center p-0">
        <Form {...form}>
          {/* <form onSubmit={form.handleSubmit(execute)}> */}
          <form>
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="avatar-input" className="cursor-pointer">
                    <Avatar className="size-24">
                      <AvatarImage
                        src={avatarPreview || ""}
                        alt="User Avatar"
                      />
                      <AvatarFallback className="text-4xl uppercase">
                        {avatarFallbackChars}
                      </AvatarFallback>
                    </Avatar>
                    <Input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        }
                      }}
                      className="hidden"
                    />
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
