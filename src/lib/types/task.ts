import { LucideProps } from "lucide-react";
import { ReactNode } from "react";
import { Database } from "../supabase/database.types";

export type TaskDb = Database["public"]["Tables"]["tasks"]["Row"];

export enum TaskParamType {
  String = "STRING",
  BrowserInstance = "BROWSER_INSTANCE",
}

export enum TaskParamName {
  WebsiteUrl = "Website URL",
  WebPage = "Web page",
  Html = "HTML",
  Selector = "Selector",
  ExtractedText = "Extracted text",
}

export enum TaskType {
  GoToWebiste = "GO_TO_WEBSITE",
  GetPageHtml = "GET_PAGE_HTML",
  ExtractTextFromElement = "EXTRACT_TEXT_FROM_ELEMENT",
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
