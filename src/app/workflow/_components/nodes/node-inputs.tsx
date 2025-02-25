import { WorkflowTaskInput } from "@/lib/types";
import NodeInput from "./node-input";

type Props = {
  nodeId: string;
  inputs: WorkflowTaskInput[];
};

export default function NodeInputs({ nodeId, inputs }: Props) {
  return (
    <div className="divide-background divide-y">
      {inputs.map((input) => (
        <NodeInput key={input.name} nodeId={nodeId} input={input} />
      ))}
    </div>
  );
}
