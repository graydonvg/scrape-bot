import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TaskInput } from "@/lib/types/task";
import { useId } from "react";
import InputLabel from "./input-label";

type Option = {
  label: string;
  value: string;
};

type Props = {
  input: TaskInput;
  defaultValue: string;
  updateNodeInputValue: (newValue: string) => void;
};

export default function SelectInput({
  input,
  defaultValue,
  updateNodeInputValue,
}: Props) {
  const id = useId();

  return (
    <div className="w-full space-y-1">
      <InputLabel id={id} label={input.name} required={input.required} />
      <Select
        defaultValue={defaultValue}
        onValueChange={(value) => updateNodeInputValue(value)}
      >
        <SelectTrigger id={id} className="bg-background w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {(input.options as Option[]).map((option) => (
            <SelectItem key={option.label} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
