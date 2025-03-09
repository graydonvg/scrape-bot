import { TaskInput } from "@/lib/types/task";

type Props = {
  input: TaskInput;
};

export default function BrowserInstanceInput({ input }: Props) {
  return <p className="text-xs">{input.name}</p>;
}
