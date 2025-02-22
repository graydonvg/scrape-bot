import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkflowTaskInput } from "@/lib/types";
import { useId, useState } from "react";

type Props = {
  input: WorkflowTaskInput;
  value: string;
  onBlur: (newValue: string) => void;
};

export default function NodeStringInput({ input, value, onBlur }: Props) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value ?? "");

  return (
    <div className="w-full space-y-1 p-1">
      <Label htmlFor={id} className="flex text-xs">
        {input.name}
        {input.required && <span className="ml-2 text-red-400">*</span>}
      </Label>
      <Input
        id={id}
        placeholder={input.helperText}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        // Update the node data using onBlur to prevent rerendering the entire card on change
        onBlur={(e) => onBlur(e.target.value)}
      />
    </div>
  );
}
