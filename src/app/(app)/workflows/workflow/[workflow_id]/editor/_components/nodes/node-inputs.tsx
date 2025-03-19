import { TaskInput } from "@/lib/types/task";
import NodeInput from "./node-input";

type Props = {
  nodeId: string;
  inputs: TaskInput[];
};

export default function NodeInputs({ nodeId, inputs }: Props) {
  return (
    <div className="divide-background divide-y-2">
      {inputs.map((input) => (
        <NodeInput key={input.name} nodeId={nodeId} input={input} />
      ))}
    </div>
  );
}
