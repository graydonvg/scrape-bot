import { Task, TaskParamName, TaskParamType, TaskType } from "@/lib/types/task";
import { BrainIcon, CodeIcon, FileJson2Icon, TextIcon } from "lucide-react";

export const getPageHtmlTask = {
  type: TaskType.GetPageHtml,
  label: "Get page HTML",
  credits: 2,
  icon: (props) => <CodeIcon className="stroke-orange-400" {...props} />,
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
  icon: (props) => <TextIcon className="stroke-orange-400" {...props} />,
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

export const extractDataWithAiTask = {
  type: TaskType.ExtractDataWithAi,
  label: "Extract data with AI",
  credits: 4,
  icon: (props) => <BrainIcon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.Content,
      type: TaskParamType.String,
      required: true,
      helperText: "HTML or text",
    },
    {
      name: TaskParamName.Credential,
      type: TaskParamType.Credential,
      required: true,
      hideHandle: true,
    },
    {
      name: TaskParamName.Prompt,
      type: TaskParamType.String,
      required: true,
      variant: "textarea",
    },
  ],
  outputs: [
    {
      name: TaskParamName.ExtractedData,
      type: TaskParamType.String,
    },
  ],
} satisfies Task;

export const extractPropertyFromJsonTask = {
  type: TaskType.ExtractPropertyFromJson,
  label: "Extract property from JSON",
  credits: 1,
  icon: (props) => <FileJson2Icon className="stroke-orange-400" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.JSON,
      type: TaskParamType.String,
      required: true,
    },
    {
      name: TaskParamName.PropertyName,
      type: TaskParamType.String,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.PropertyValue,
      type: TaskParamType.String,
    },
  ],
} satisfies Task;
