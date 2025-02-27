import {
  WorkflowTask,
  WorkflowTaskParamType,
  WorkflowTaskType,
} from "@/lib/types";
import { CodeIcon, GlobeIcon, LucideProps, TextIcon } from "lucide-react";

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
      type: WorkflowTaskParamType.BroswerInstance,
      required: true,
    },
  ],
  outputs: [
    {
      name: "HTML",
      type: WorkflowTaskParamType.String,
    },
    {
      name: "Web page",
      type: WorkflowTaskParamType.BroswerInstance,
    },
  ],
};

export const extractTextFromElementTask: WorkflowTask = {
  type: WorkflowTaskType.ExtractTextFromElement,
  label: "Extract text from element",
  icon: (props: LucideProps) => (
    <TextIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "HTML",
      type: WorkflowTaskParamType.String,
      required: true,
      variant: "textarea",
    },
    {
      name: "Selector",
      type: WorkflowTaskParamType.String,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Extracted text",
      type: WorkflowTaskParamType.String,
    },
  ],
};
