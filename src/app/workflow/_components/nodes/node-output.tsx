import { WorkflowTaskOutput } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Handle, Position } from "@xyflow/react";
import { nodeHandleColor } from "./common";

type Props = {
  output: WorkflowTaskOutput;
};

export default function NodeOutput({ output }: Props) {
  return (
    <div className="relative flex w-full justify-end rounded-b-md px-4 py-3">
      <Handle
        id={output.name}
        type="source"
        position={Position.Right}
        className={cn(
          "!bg-muted-foreground !border-background !size-4 !border-2",
          nodeHandleColor[output.type],
        )}
      />

      <span className="text-muted-foreground text-xs">{output.name}</span>
    </div>
  );
}
