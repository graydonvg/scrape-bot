"use client";

import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  titleClassName?: string;
  subtitleClassName?: string;
  iconClassName?: string;
};

export default function CustomDialogHeader(props: Props) {
  return (
    <DialogHeader className="mb-4">
      <DialogTitle
        className={cn(
          "text-primary flex flex-col items-center gap-2 text-xl dark:text-blue-500",
          props.titleClassName,
        )}
      >
        {props.icon && (
          <props.icon size={30} className={cn(props.iconClassName)} />
        )}
        {props.title && props.title}
      </DialogTitle>
      <DialogDescription
        className={cn(
          "text-muted-foreground text-center text-sm",
          props.subtitleClassName,
        )}
      >
        {props.subtitle}
      </DialogDescription>
    </DialogHeader>
  );
}
