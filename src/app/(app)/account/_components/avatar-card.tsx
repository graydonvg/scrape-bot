"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserDb } from "@/lib/types/user";
import { getUserAvatarFallbackChars, getUsername } from "@/lib/utils";
import { toast } from "sonner";
import { userErrorMessages } from "@/lib/constants";
import useUserStore from "@/lib/store/user-store";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "next-safe-action/hooks";
import uploadAvatarAction from "../_actions/upload-avatar-action";

const TOAST_ID = "upload-avatar";
const MAX_FILE_SIZE_MB = 2;

type Props = {
  user: UserDb;
};

export default function AvatarCard({ user }: Props) {
  const userName = getUsername(user);
  const { avatarPreviewUrl, setAvatarPreviewUrl } = useUserStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const avatarUrl =
    avatarPreviewUrl || user.customAvatarUrl || user.providerAvatarUrl || "";
  const avatarFallbackChars = getUserAvatarFallbackChars(user);
  const [isLoadingAvatarImage, setIsLoadingAvatarImage] = useState(
    Boolean(avatarUrl),
  );
  const { execute, isPending } = useAction(uploadAvatarAction, {
    onExecute: () => toast.loading("Uploading avatar...", { id: TOAST_ID }),
    onSuccess: ({ data }) => {
      if (!data?.success) {
        return toast.error(data?.message, { id: TOAST_ID });
      }

      toast.success(data.message, { id: TOAST_ID });
    },
    onError: () => toast.error(userErrorMessages.Unexpected, { id: TOAST_ID }),
  });

  useEffect(() => {
    // Set the preview url to update the avatar in the sidebar user menu
    if (selectedFile) setAvatarPreviewUrl(URL.createObjectURL(selectedFile));
  }, [selectedFile, setAvatarPreviewUrl]);

  useEffect(() => {
    // Dismiss the toast if the component unmounts before the upload completes
    return () => {
      toast.dismiss(TOAST_ID);
    };
  }, []);

  return (
    <Card>
      <div className="flex items-center justify-between gap-6 p-6">
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
          <label htmlFor="avatar-input" className="cursor-pointer">
            <div className="relative size-24 rounded-full">
              {isLoadingAvatarImage && (
                <Skeleton className="bg-muted absolute inset-0 z-0 size-24 rounded-full" />
              )}
              <Avatar className="z-10 size-24">
                {avatarUrl.length > 0 ? (
                  <AvatarImage
                    src={avatarUrl}
                    alt={`${userName}'s avatar`}
                    onLoad={() => setIsLoadingAvatarImage(false)}
                    onError={() => setIsLoadingAvatarImage(false)}
                    fetchPriority="high"
                  />
                ) : (
                  <AvatarFallback className="uppercase">
                    {avatarFallbackChars}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            {!isPending && (
              <Input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            )}
          </label>
        </CardContent>
      </div>
      <CardFooter className="gap-6 border-t py-3">
        <p className="text-muted-foreground text-sm text-pretty">
          {isPending ? "Uploading..." : " Maximum file size: 2MB."}
        </p>
      </CardFooter>
    </Card>
  );

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);

    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setSelectedFile(null);
      return toast.error(
        `File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`,
      );
    }

    const currentFileExt = user.customAvatarUrl
      ?.split("avatars/")
      .pop()
      ?.split(".")
      .pop();

    setSelectedFile(file);
    execute({ avatar: file, currentFileExt });
  }
}
