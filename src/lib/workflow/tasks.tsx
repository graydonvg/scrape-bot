import {
  WorkflowTask,
  WorkflowTaskInputType,
  WorkflowTaskType,
} from "@/lib/types";
import { CodeIcon, GlobeIcon, LucideProps } from "lucide-react";

export const launchBrowserTask: WorkflowTask = {
  type: WorkflowTaskType.LaunchBrowser,
  label: "Launch browser",
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: true,
  inputs: [
    {
      name: "Website URL",
      type: WorkflowTaskInputType.String,
      helperText: "e.g. https://www.example.com",
      required: true,
      hideHandle: true,
    },
  ],
};

export const getPageHtmlTask: WorkflowTask = {
  type: WorkflowTaskType.GetPageHtml,
  label: "Get page HTML",
  icon: (props: LucideProps) => (
    <CodeIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: WorkflowTaskInputType.BroswerInstance,
      required: true,
    },
  ],
};
