import StringInput from "./inputs/string-input";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import BrowserInstanceInput from "./inputs/browser-instance-input";
import { TaskInput, TaskParamType } from "@/lib/types/task";
import { WorkflowNode } from "@/lib/types/workflow";
import SelectInput from "./inputs/select-input";

type Props = {
  nodeId: string;
  input: TaskInput;
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
    case TaskParamType.String:
      return (
        <StringInput
          input={input}
          value={inputValue}
          onBlur={updateNodeInputValue}
          disabled={disabled}
        />
      );

    case TaskParamType.BrowserInstance:
      return <BrowserInstanceInput input={input} />;

    case TaskParamType.Select:
      return (
        <SelectInput
          input={input}
          defaultValue={inputValue}
          updateNodeInputValue={updateNodeInputValue}
        />
      );

    default:
      return <p className="text-muted-foreground text-xs">Not implemented</p>;
  }
}
