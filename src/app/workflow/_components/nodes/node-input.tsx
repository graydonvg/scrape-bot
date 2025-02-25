import { WorkflowTaskInput } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Handle, Position } from "@xyflow/react";
import NodeInputField from "./node-input-field";

type Props = {
  nodeId: string;
  input: WorkflowTaskInput;
};

export default function NodeInput({ nodeId, input }: Props) {
  return (
    <div className="bg-muted relative flex w-full p-3">
      <NodeInputField input={input} nodeId={nodeId} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-background !size-4 !border-2",
          )}
        />
      )}
    </div>
  );
}
