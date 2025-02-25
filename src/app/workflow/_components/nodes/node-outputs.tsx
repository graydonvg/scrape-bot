import { WorkflowTaskOutput } from "@/lib/types";
import NodeOutput from "./node-output";

type Props = {
  outputs: WorkflowTaskOutput[];
};

export default function NodeOutputs({ outputs }: Props) {
  return (
    <div className="divide-background bg-muted divide-y-2">
      {outputs.map((output) => (
        <NodeOutput key={output.name} output={output} />
      ))}
    </div>
  );
}
