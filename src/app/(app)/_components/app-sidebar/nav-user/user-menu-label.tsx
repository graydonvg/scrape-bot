import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import useUserStore from "@/lib/store/user-store";
import { UserDb } from "@/lib/types/user";
import { useState } from "react";

type Props = {
  user: UserDb;
  userName: string;
  avatarFallbackChars: string;
};

export default function UserMenuLabel({
  user,
  userName,
  avatarFallbackChars,
}: Props) {
  const { avatarPreviewUrl } = useUserStore();
  const avatarUrl =
    avatarPreviewUrl || user.customAvatarUrl || user.providerAvatarUrl || "";
  const [isLoading, setIsLoading] = useState(Boolean(avatarUrl));

  return (
    <>
      <div className="relative size-8 rounded-md">
        {isLoading && (
          <Skeleton className="bg-sidebar-accent absolute inset-0 z-0 size-8 rounded-md" />
        )}
        <Avatar className="z-10 size-8 rounded-md">
          <AvatarImage
            src={avatarUrl}
            alt={`${userName}'s avatar`}
            onLoad={() => setIsLoading(false)}
            fetchPriority="high"
          />
          <AvatarFallback className="rounded-md uppercase">
            {avatarFallbackChars}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{userName}</span>
        <span className="truncate text-xs">{user.email}</span>
      </div>
    </>
  );
}
