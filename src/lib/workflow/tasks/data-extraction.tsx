import { Task, TaskParamName, TaskParamType, TaskType } from "@/lib/types/task";
import { CodeIcon, LucideProps, TextIcon } from "lucide-react";

export const getPageHtmlTask = {
  type: TaskType.GetPageHtml,
  label: "Get page HTML",
  credits: 2,
  icon: (props: LucideProps) => (
    <CodeIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BrowserInstance,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.Html,
      type: TaskParamType.String,
    },
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BrowserInstance,
    },
  ],
} satisfies Task;

export const extractTextFromElementTask = {
  type: TaskType.ExtractTextFromElement,
  label: "Extract text from element",
  credits: 2,
  icon: (props: LucideProps) => (
    <TextIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.Html,
      type: TaskParamType.String,
      required: true,
      variant: "textarea",
    },
    {
      name: TaskParamName.Selector,
      type: TaskParamType.String,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.ExtractedText,
      type: TaskParamType.String,
    },
  ],
} satisfies Task;
