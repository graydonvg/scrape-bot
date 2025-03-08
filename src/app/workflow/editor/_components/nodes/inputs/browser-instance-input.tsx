import { WorkflowTaskInput } from "@/lib/types/workflow";

type Props = {
  input: WorkflowTaskInput;
};

export default function BrowserInstanceInput({ input }: Props) {
  return <p className="text-xs">{input.name}</p>;
}
