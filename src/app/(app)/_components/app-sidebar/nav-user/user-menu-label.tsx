import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

type Props = {
  userName: string;
  email: string;
  avatarUrl: string | null;
  avatarFallbackChars: string;
};

export default function UserMenuLabel({
  userName,
  avatarFallbackChars,
  email,
  avatarUrl,
}: Props) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      <Avatar className="size-8 rounded-md">
        {avatarUrl && hasLoaded && !hasError ? (
          <AvatarImage
            src={avatarUrl}
            alt={`${userName} avatar`}
            onLoad={() => setHasLoaded(true)}
            onError={() => setHasError(true)}
          />
        ) : (
          <AvatarFallback className="rounded-md uppercase">
            {avatarFallbackChars}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{userName}</span>
        <span className="truncate text-xs">{email}</span>
      </div>
    </>
  );
}
