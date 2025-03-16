import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  containerClassName?: string;
  children?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  containerClassName,
  children,
}: Props) {
  return (
    <div
      className={cn(
        "mb-8 flex items-center justify-between",
        containerClassName,
      )}
    >
      <div className="mr-6 flex shrink-0 flex-col">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
