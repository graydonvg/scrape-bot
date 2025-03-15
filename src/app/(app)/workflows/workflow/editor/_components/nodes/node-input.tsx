import { cn } from "@/lib/utils";
import { Handle, Position, useEdges } from "@xyflow/react";
import NodeInputField from "./node-input-field";
import { nodeHandleColor } from "./common";
import useWorkflowsStore from "@/lib/store/workflows-store";
import { TaskInput } from "@/lib/types/task";

type Props = {
  nodeId: string;
  input: TaskInput;
};

export default function NodeInput({ nodeId, input }: Props) {
  const edges = useEdges();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name,
  );
  const { invalidInputs } = useWorkflowsStore();

  const invalidNode = invalidInputs?.find(
    (invalidInput) => invalidInput.nodeId === nodeId,
  );
  const invalidInputNames = invalidNode?.inputNames;
  const hasInvalidInput = invalidInputNames?.includes(input.name) || false;

  return (
    <div
      className={cn("relative flex w-full px-4 py-3", {
        "bg-destructive/30": hasInvalidInput,
      })}
    >
      <NodeInputField
        input={{ ...input, isInvalid: hasInvalidInput }}
        nodeId={nodeId}
        disabled={isConnected}
      />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConnected}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-background !size-4 !border-2",
            nodeHandleColor[input.type],
          )}
        />
      )}
    </div>
  );
}
