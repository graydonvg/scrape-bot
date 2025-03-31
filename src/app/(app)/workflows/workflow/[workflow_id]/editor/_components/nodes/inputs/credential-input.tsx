import { TaskInput } from "@/lib/types/task";
import InputLabel from "./input-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useId } from "react";
import { useQuery } from "@tanstack/react-query";
import getUserCredentialsClient from "../../../_data-access/get-user-credentials-client";

type Props = {
  input: TaskInput;
  defaultValue: string;
  updateNodeInputValue: (newValue: string) => void;
};

export default function CredentialInput({
  input,
  defaultValue,
  updateNodeInputValue,
}: Props) {
  const id = useId();
  const query = useQuery({
    queryKey: ["user-credentials"],
    queryFn: () => getUserCredentialsClient(),
  });

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
        <SelectContent className="max-h-[160px]">
          {query.data?.map((credential) => (
            <SelectItem
              key={credential.credentialId}
              value={credential.credentialId}
            >
              {credential.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
