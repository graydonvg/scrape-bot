import { Task, TaskParamName, TaskParamType, TaskType } from "@/lib/types/task";
import { GlobeIcon, LucideProps } from "lucide-react";

export const launchBrowserTask = {
  type: TaskType.LaunchBrowser,
  label: "Launch browser",
  credits: 5,
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: true,
  inputs: [
    {
      name: TaskParamName.WebsiteUrl,
      type: TaskParamType.String,
      helperText: "e.g. https://www.example.com",
      required: true,
      hideHandle: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BrowserInstance,
    },
  ],
} satisfies Task;
