import { NodeProps } from "@xyflow/react";
import NodeCard from "./node-card";
import NodeHeader from "./node-header";
import { WorkflowNodeData } from "@/lib/types";
import { taskRegistry } from "@/lib/workflow/task-registry";
import NodeInputs from "./node-inputs";
import NodeInput from "./node-input";

export default function Node(props: NodeProps) {
  const nodeData = props.data as WorkflowNodeData;
  const taskType = nodeData.type;
  const task = taskRegistry[taskType];

  return (
    <NodeCard nodeId={props.id} isSelected={props.selected}>
      <NodeHeader taskType={taskType} />
      <NodeInputs>
        {task.inputs.map((input) => (
          <NodeInput key={input.name} nodeId={props.id} input={input} />
        ))}
      </NodeInputs>
    </NodeCard>
  );
}
