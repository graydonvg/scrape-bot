import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  return (
    <>
      <Avatar className="size-8 rounded-md">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={`${userName} avatar`} />
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
