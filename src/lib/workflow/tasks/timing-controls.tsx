import { Task, TaskParamName, TaskParamType, TaskType } from "@/lib/types/task";
import { EyeIcon } from "lucide-react";

export const waitForElementTask = {
  type: TaskType.WaitForElement,
  label: "Wait for element",
  credits: 1,
  icon: (props) => <EyeIcon className="stroke-yellow-400" {...props} />,
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
    {
      name: TaskParamName.MaxWaitTime,
      type: TaskParamType.String,
      required: false,
      hideHandle: true,
      helperText: "Defaults to `30000` (30 seconds)",
    },
  ],
  outputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BrowserInstance,
    },
  ],
} satisfies Task;
