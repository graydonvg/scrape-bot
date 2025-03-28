import { AlertCircleIcon, TriangleAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle, alertVariants } from "./ui/alert";
import { VariantProps } from "class-variance-authority";

type Props = {
  title: string;
  description: string;
  variant: VariantProps<typeof alertVariants>["variant"];
};

export default function CustomAlert({ title, description, variant }: Props) {
  return (
    <Alert variant={variant} className="text-center text-pretty sm:text-left">
      {variant === "destructive" && <AlertCircleIcon />}
      {variant === "warning" && <TriangleAlertIcon />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
