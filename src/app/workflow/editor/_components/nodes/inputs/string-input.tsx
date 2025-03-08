import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WorkflowTaskInput } from "@/lib/types/workflow";
import {
  ChangeEvent,
  ElementType,
  FocusEvent,
  useEffect,
  useId,
  useState,
} from "react";

type Props = {
  input: WorkflowTaskInput;
  value: string;
  onBlur: (newValue: string) => void;
  disabled: boolean;
};

export default function StringInput({ input, value, onBlur, disabled }: Props) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(value ?? "");
  let Component: ElementType = Input;

  if (input.variant === "textarea") {
    Component = Textarea;
  }

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  return (
    <div className="w-full space-y-1 p-1">
      <Label htmlFor={id} className="flex text-xs">
        {input.name}
        {input.required && <span className="ml-2 text-red-400">*</span>}
      </Label>
      <Component
        id={id}
        placeholder={input.helperText}
        value={internalValue}
        disabled={disabled}
        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          setInternalValue(e.target.value)
        }
        // Update the node data using onBlur to prevent rerendering the entire card on change
        onBlur={(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onBlur(e.target.value)
        }
      />
    </div>
  );
}
