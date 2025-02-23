import { Slot } from "@radix-ui/react-slot";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
import { ReactNode } from "react";

export default function ButtonWithSpinner({
  className,
  variant,
  size,
  loading,
  startIcon,
  spinnerClassName,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    startIcon?: ReactNode;
    spinnerClassName?: string;
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || props.disabled}
      {...props}
    >
      {!loading ? (
        startIcon
      ) : (
        <Loader2Icon className={cn("size-4 animate-spin", spinnerClassName)} />
      )}
      {props.children}
    </Comp>
  );
}
