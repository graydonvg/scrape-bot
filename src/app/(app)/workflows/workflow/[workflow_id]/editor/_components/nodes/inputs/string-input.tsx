import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TaskInput } from "@/lib/types/task";
import {
  ChangeEvent,
  ElementType,
  FocusEvent,
  useEffect,
  useId,
  useState,
} from "react";
import InputLabel from "./input-label";

type Props = {
  input: TaskInput;
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
    <div className="w-full space-y-1">
      <InputLabel id={id} label={input.name} required={input.required} />
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
