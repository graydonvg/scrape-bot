import { Label } from "@/components/ui/label";

type Props = {
  id?: string;
  label: string;
  required?: boolean;
};

export default function InputLabel({ id, label, required }: Props) {
  return (
    <Label htmlFor={id} className="flex text-xs">
      {label}
      {required && <span className="ml-2 text-red-400">*</span>}
    </Label>
  );
}
