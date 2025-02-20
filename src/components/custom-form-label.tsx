import { FormLabel } from "./ui/form";

type Props = {
  label: string;
  optional: boolean;
};

export default function CustomFormLabel({ label, optional }: Props) {
  return (
    <FormLabel className="flex items-center gap-1">
      {label}
      {optional ? (
        <span className="text-muted-foreground text-xs">(optional)</span>
      ) : (
        <span className="text-primary text-xs dark:text-blue-500">
          (required)
        </span>
      )}
    </FormLabel>
  );
}
