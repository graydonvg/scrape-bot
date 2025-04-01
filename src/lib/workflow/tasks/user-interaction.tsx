import { Task, TaskParamName, TaskParamType, TaskType } from "@/lib/types/task";
import {
  Edit3Icon,
  MousePointerClickIcon,
  MoveVerticalIcon,
  NavigationIcon,
} from "lucide-react";

export const fillInputFieldTask = {
  type: TaskType.FillInputField,
  label: "Fill input field",
  credits: 1,
  icon: (props) => <Edit3Icon className="stroke-red-400" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BrowserInstance,
      required: true,
    },
    {
      name: TaskParamName.Selector,
      type: TaskParamType.String,
      required: true,
    },
    {
      name: TaskParamName.Value,
      type: TaskParamType.String,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BrowserInstance,
    },
  ],
} satisfies Task;

export const clickElementTask = {
  type: TaskType.ClickElement,
  label: "Click element",
  credits: 1,
  icon: (props) => (
    <MousePointerClickIcon className="stroke-red-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BrowserInstance,
      required: true,
    },
    {
      name: TaskParamName.Selector,
      type: TaskParamType.String,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BrowserInstance,
    },
  ],
} satisfies Task;

export const navigateToUrlTask = {
  type: TaskType.NavigateToUrl,
  label: "Navigate to URL",
  credits: 2,
  icon: (props) => <NavigationIcon className="stroke-red-400" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BrowserInstance,
      required: true,
    },
    {
      name: TaskParamName.WebsiteUrl,
      type: TaskParamType.String,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BrowserInstance,
    },
  ],
} satisfies Task;

export const scrollToElementTask = {
  type: TaskType.ScrollToElement,
  label: "Scroll to element",
  credits: 1,
  icon: (props) => <MoveVerticalIcon className="stroke-red-400" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BrowserInstance,
      required: true,
    },
    {
      name: TaskParamName.Selector,
      type: TaskParamType.String,
      required: true,
    },
  ],
  outputs: [
    {
      name: TaskParamName.WebPage,
      type: TaskParamType.BrowserInstance,
    },
  ],
} satisfies Task;
