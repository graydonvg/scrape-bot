import {
  WorkflowTask,
  WorkflowTaskInputType,
  WorkflowTaskType,
} from "@/lib/types";
import { GlobeIcon, LucideProps } from "lucide-react";

export const launchBrowserTask: WorkflowTask = {
  type: WorkflowTaskType.LaunchBrowser,
  label: "Launch browser",
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: true,
  inputs: [
    {
      name: "Website Url",
      type: WorkflowTaskInputType.String,
      helperText: "e.g. https://www.example.com",
      required: true,
      hideHandle: true,
    },
  ],
};
