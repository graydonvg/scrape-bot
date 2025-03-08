import { Database } from "../supabase/database.types";

export type LogDb = Pick<
  Database["public"]["Tables"]["taskLogs"]["Row"],
  "logLevel" | "message" | "timestamp" | "taskId"
>;
export type LogLevelDb = Database["public"]["Enums"]["LogLevel"];
export type LogFunction = (taskId: string, message: string) => void;

export type LogCollector = {
  getAll: () => LogDb[];
} & {
  [K in LogLevelDb]: LogFunction;
};
