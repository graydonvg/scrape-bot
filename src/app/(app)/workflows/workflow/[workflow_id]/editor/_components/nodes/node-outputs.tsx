import { TaskOutput } from "@/lib/types/task";
import NodeOutput from "./node-output";

type Props = {
  outputs: TaskOutput[];
};

export default function NodeOutputs({ outputs }: Props) {
  if (outputs.length === 0) return null;

  return (
    <div className="divide-background divide-y-2 rounded-b-xl">
      {outputs.map((output) => (
        <NodeOutput key={output.name} output={output} />
      ))}
    </div>
  );
}
