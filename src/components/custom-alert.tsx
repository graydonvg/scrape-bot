import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type Props = {
  title: string;
  description: string;
};

export default function CustomAlert({ title, description }: Props) {
  return (
    <Alert
      variant="destructive"
      className="text-center text-pretty sm:text-left"
    >
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
