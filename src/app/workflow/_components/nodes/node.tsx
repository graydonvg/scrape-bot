import { NodeProps } from "@xyflow/react";
import NodeCard from "./node-card";
import NodeHeader from "./node-header";
import { WorkflowNodeData } from "@/lib/types";
import { taskRegistry } from "@/lib/workflow/task-registry";
import NodeInputs from "./node-inputs";
import NodeOutputs from "./node-outputs";
import { Badge } from "@/components/ui/badge";

const devMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";

export default function Node(props: NodeProps) {
  const nodeData = props.data as WorkflowNodeData;
  const taskType = nodeData.type;
  const task = taskRegistry[taskType];

  return (
    <NodeCard nodeId={props.id} isSelected={props.selected}>
      {devMode && <Badge>Dev: {props.id}</Badge>}
      <NodeHeader taskType={taskType} nodeId={props.id} />
      <div className="divide-background bg-muted divide-y-2 rounded-md">
        <NodeInputs nodeId={props.id} inputs={task.inputs} />
        <NodeOutputs outputs={task.outputs} />
      </div>
    </NodeCard>
  );
}
