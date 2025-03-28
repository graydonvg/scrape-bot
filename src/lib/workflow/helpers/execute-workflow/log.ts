import "server-only";

import { LogDb, LogCollector, LogFunction, LogLevelDb } from "@/lib/types/log";

// These logs will be added to the database and ***ARE AVAILABLE TO THE USER***.
// These logs contain details about the executed tasks. ***NO SENSITIVE DETAILS!***
// Sensitive details are handled by a separate logger (Axiom).

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//                 ***LOGS ARE AVAILABLE TO THE USER***
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//                      ***NO SENSITIVE DETAILS!***
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export default function createLogCollector(): LogCollector {
  const logs: LogDb[] = [];
  const getAll = () => logs;

  const logLevels = ["ERROR", "INFO"] as LogLevelDb[];
  const logFns = {} as Record<LogLevelDb, LogFunction>;

  logLevels.forEach(
    (logLevel) =>
      (logFns[logLevel] = (taskId: string, message: string) =>
        logs.push({
          taskId,
          logLevel,
          message,
          timestamp: new Date().toISOString(),
        })),
  );

  return {
    getAll,
    ...logFns,
  };
}
