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
      <div className="mr-6 flex flex-col">
        <h1 className="flex-wrap text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
