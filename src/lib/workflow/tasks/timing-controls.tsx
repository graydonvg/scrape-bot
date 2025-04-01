import { Task, TaskParamName, TaskParamType, TaskType } from "@/lib/types/task";
import { EyeIcon } from "lucide-react";

export const waitForElementTask = {
  type: TaskType.WaitForElement,
  label: "Wait for element",
  credits: 1,
  icon: (props) => (
    <EyeIcon className="stroke-green-600 dark:stroke-green-400" {...props} />
  ),
  isEntryPoint: false,

  inputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BrowserInstance,
      required: true,
    },
    {
      name: TaskParamName.Selector,
      type: TaskParamType.String,
      required: true,
    },
    {
      name: TaskParamName.Visibility,
      type: TaskParamType.Select,
      required: true,
      hideHandle: true,
      options: [
        {
          label: "Visible",
          value: "visible",
        },
        {
          label: "Hidden",
          value: "hidden",
        },
      ],
    },
  ],
  outputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BrowserInstance,
    },
  ],
} satisfies Task;
