import { Task, TaskParamName, TaskParamType, TaskType } from "@/lib/types/task";
import { FileJsonIcon } from "lucide-react";

export const addPropertyToJsonTask = {
  type: TaskType.AddPropertyToJson,
  label: "Add property to JSON",
  credits: 1,
  icon: (props) => <FileJsonIcon className="stroke-yellow-400" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.Json,
      type: TaskParamType.String,
      required: true,
    },
    {
      name: TaskParamName.PropertyName,
      type: TaskParamType.String,
      required: true,
    },
    {
      name: TaskParamName.PropertyValue,
      type: TaskParamType.String,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.UpdatedJson,
      type: TaskParamType.String,
    },
  ],
} satisfies Task;
