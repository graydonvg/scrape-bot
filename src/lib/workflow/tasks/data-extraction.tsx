import {
  WorkflowTask,
  WorkflowTaskParamType,
  WorkflowTaskType,
} from "@/lib/types";
import { CodeIcon, LucideProps, TextIcon } from "lucide-react";

export const getPageHtmlTask = {
  type: WorkflowTaskType.GetPageHtml,
  label: "Get page HTML",
  credits: 2,
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
} satisfies WorkflowTask;

export const extractTextFromElementTask = {
  type: WorkflowTaskType.ExtractTextFromElement,
  label: "Extract text from element",
  credits: 2,
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
} satisfies WorkflowTask;
