import { NodeProps } from "@xyflow/react";
import NodeCard from "./node-card";
import NodeHeader from "./node-header";
import { WorkflowNodeData } from "@/lib/types";
import { taskRegistry } from "@/lib/workflow/task-registry";
import NodeInputs from "./node-inputs";
import NodeOutputs from "./node-outputs";

export default function Node(props: NodeProps) {
  const nodeData = props.data as WorkflowNodeData;
  const taskType = nodeData.type;
  const task = taskRegistry[taskType];

  return (
    <NodeCard nodeId={props.id} isSelected={props.selected}>
      <NodeHeader taskType={taskType} nodeId={props.id} />
      <div className="divide-background bg-muted divide-y-2">
        <NodeInputs nodeId={props.id} inputs={task.inputs} />
        <NodeOutputs outputs={task.outputs} />
      </div>
    </NodeCard>
  );
}
