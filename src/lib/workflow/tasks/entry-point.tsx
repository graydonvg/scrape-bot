import {
  WorkflowTask,
  WorkflowTaskParamType,
  WorkflowTaskType,
} from "@/lib/types";
import { GlobeIcon, LucideProps } from "lucide-react";

export const launchBrowserTask = {
  type: WorkflowTaskType.LaunchBrowser,
  label: "Launch browser",
  credits: 5,
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: true,
  inputs: [
    {
      name: "Website URL",
      type: WorkflowTaskParamType.String,
      helperText: "e.g. https://www.example.com",
      required: true,
      hideHandle: true,
    },
  ],
  outputs: [
    {
      name: "Web page",
      type: WorkflowTaskParamType.BroswerInstance,
    },
  ],
} satisfies WorkflowTask;
