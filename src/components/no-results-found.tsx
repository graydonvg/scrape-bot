import { InboxIcon } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  icon?: ReactNode;
  children?: ReactNode;
};

export default function NoResultsFound({
  title,
  description,
  icon,
  children,
}: Props) {
  return (
    <div className="flex-center size-full flex-col gap-4">
      <div className="bg-accent flex-center size-20 rounded-full">
        {icon ? (
          icon
        ) : (
          <InboxIcon className="stroke-primary size-10 dark:stroke-blue-500" />
        )}
      </div>

      <div className="flex flex-col gap-1 text-center">
        <h2 className="font-bold">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {children}
    </div>
  );
}
