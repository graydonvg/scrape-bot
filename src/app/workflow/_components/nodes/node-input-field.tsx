import {
  WorkflowNode,
  WorkflowTaskInput,
  WorkflowTaskInputType,
} from "@/lib/types";
import NodeStringInput from "./inputs/node-string-input";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

type Props = {
  nodeId: string;
  input: WorkflowTaskInput;
};

export default function NodeInputField({ nodeId, input }: Props) {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as WorkflowNode;
  const inputValue = node.data.inputs[input.name];

  const updateNodeInputValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node.data.inputs,
          [input.name]: newValue,
        },
      });
    },
    [updateNodeData, nodeId, input.name, node.data.inputs],
  );

  switch (input.type) {
    case WorkflowTaskInputType.String:
      return (
        <NodeStringInput
          input={input}
          value={inputValue}
          onBlur={updateNodeInputValue}
        />
      );

    default:
      return <p className="text-muted-foreground text-xs">Not implemented</p>;
  }
}
