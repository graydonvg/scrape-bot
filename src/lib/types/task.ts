import { LucideProps } from "lucide-react";
import { ReactNode } from "react";
import { Database } from "../supabase/database.types";

export type TaskDb = Database["public"]["Tables"]["tasks"]["Row"];

export enum TaskParamType {
  BrowserInstance = "BROWSER_INSTANCE",
  String = "STRING",
  Select = "SELECT",
  Credential = "CREDENTIAL",
}

export enum TaskParamName {
  WebsiteUrl = "Website URL",
  WebPage = "Web page",
  Html = "HTML",
  Selector = "Selector",
  ExtractedText = "Extracted text",
  ExtractedData = "Extracted data (JSON)",
  Value = "Value to enter",
  Visibility = "Visibility",
  MaxWaitTime = "Maximum time to wait (ms)",
  TargetUrl = "Target URL",
  Body = "Body",
  Content = "Content",
  Credential = "Credential",
  Prompt = "Prompt",
  JSON = "JSON",
  PropertyName = "Property name",
  PropertyValue = "Property value",
}

export enum TaskType {
  GoToWebiste = "GO_TO_WEBSITE",
  GetPageHtml = "GET_PAGE_HTML",
  ExtractTextFromElement = "EXTRACT_TEXT_FROM_ELEMENT",
  FillInputField = "FILL_INPUT_FIELD",
  ClickElement = "CLICK_ELEMENT",
  WaitForElement = "WAIT_FOR_ELEMENT",
  DeliverViaWebhook = "DELIVER_VIA_WEBHOOK",
  ExtractDataWithAi = "EXTRACT_DATA_WITH_AI",
  ExtractPropertyFromJson = "EXTRACT_PROPERTY_FROM_JSON",
}

export type TaskInput = {
  name: TaskParamName;
  type: TaskParamType;
  helperText?: string;
  required?: boolean;
  hideHandle?: boolean;
  variant?: string;
  [key: string]: unknown;
};

export type TaskOutput = {
  name: TaskParamName;
  type: TaskParamType;
};

export type Task = {
  type: TaskType;
  label: string;
  credits: number;
  icon: (props: LucideProps) => ReactNode;
  isEntryPoint: boolean;
  inputs: TaskInput[];
  outputs: TaskOutput[];
};
