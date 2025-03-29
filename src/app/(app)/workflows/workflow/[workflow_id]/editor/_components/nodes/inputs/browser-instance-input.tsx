import { TaskInput } from "@/lib/types/task";
import InputLabel from "./input-label";

type Props = {
  input: TaskInput;
};

export default function BrowserInstanceInput({ input }: Props) {
  return <InputLabel label={input.name} required={input.required} />;
}
