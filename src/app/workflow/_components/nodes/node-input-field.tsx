import {
  WorkflowNode,
  WorkflowTaskInput,
  WorkflowTaskParamType,
} from "@/lib/types";
import StringInput from "./inputs/string-input";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import BrowserInstanceInput from "./inputs/browser-instance-input";

type Props = {
  nodeId: string;
  input: WorkflowTaskInput;
  disabled: boolean;
};

export default function NodeInputField({ nodeId, input, disabled }: Props) {
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
    case WorkflowTaskParamType.String:
      return (
        <StringInput
          input={input}
          value={inputValue}
          onBlur={updateNodeInputValue}
          disabled={disabled}
        />
      );

    case WorkflowTaskParamType.BroswerInstance:
      return <BrowserInstanceInput input={input} />;

    default:
      return <p className="text-muted-foreground text-xs">Not implemented</p>;
  }
}
