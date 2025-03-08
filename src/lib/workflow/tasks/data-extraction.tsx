import {
  WorkflowTask,
  WorkflowTaskParamName,
  WorkflowTaskParamType,
  WorkflowTaskType,
} from "@/lib/types/workflow";
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
      name: WorkflowTaskParamName.WebPage,
      type: WorkflowTaskParamType.BrowserInstance,
      required: true,
    },
  ],
  outputs: [
    {
      name: WorkflowTaskParamName.Html,
      type: WorkflowTaskParamType.String,
    },
    {
      name: WorkflowTaskParamName.WebPage,
      type: WorkflowTaskParamType.BrowserInstance,
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
      name: WorkflowTaskParamName.Html,
      type: WorkflowTaskParamType.String,
      required: true,
      variant: "textarea",
    },
    {
      name: WorkflowTaskParamName.Selector,
      type: WorkflowTaskParamType.String,
      required: true,
    },
  ],
  outputs: [
    {
      name: WorkflowTaskParamName.ExtractedText,
      type: WorkflowTaskParamType.String,
    },
  ],
} satisfies WorkflowTask;
