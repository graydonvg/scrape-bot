import { Task, TaskParamName, TaskParamType, TaskType } from "@/lib/types/task";
import { WebhookIcon } from "lucide-react";

export const deliverViaWebhookTask = {
  type: TaskType.DeliverViaWebhook,
  label: "Deliver via webhook",
  credits: 1,
  icon: (props) => (
    <WebhookIcon className="stroke-sky-600 dark:stroke-sky-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.TargetUrl,
      type: TaskParamType.String,
      required: true,
    },
    {
      name: TaskParamName.Body,
      type: TaskParamType.String,
      required: true,
    },
  ],
  outputs: [],
} satisfies Task;
