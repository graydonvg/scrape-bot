import { Database } from "./supabase/database.types";

export type ActionReturn<T = void> = {
  success: boolean;
  field?: T;
  type?: string;
  message: string;
};

export type WorkflowStatus = Database["public"]["Enums"]["workflow_status"];

export type Workflow = Database["public"]["Tables"]["workflows"]["Row"];
