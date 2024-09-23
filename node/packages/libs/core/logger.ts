/* eslint-disable no-console */
import pino from "pino";

import { getOptional } from "./env";
import { LogCall, Logger } from "./types";

const defaultLogLevel = "info";

/**
 * Adapt console log functions (console.log, console.info, etc) into the same method
 * (object, message) signature as Pino's log methods.
 */
function adaptConsoleLog(logMethod: typeof console.info): LogCall {
  return (obj: unknown, message?: string) => logMethod(message, obj);
}

export function createLogger(name: string): Logger {
  // Use pino within node environments
  const hasProcess = typeof process === "object";
  const inBrowser = "browser" in process;
  if (!inBrowser) {
    const level = hasProcess ? getOptional("LOG_LEVEL", defaultLogLevel) : defaultLogLevel;
    return pino({
      name,
      level,
      formatters: {
        level: (label) => ({ level: label }),
      },
      serializers: {
        ...pino.stdSerializers,
        error: pino.stdSerializers.err,
      },
    });
  }
  // Fallback to console logs if not in a node environment
  return {
    name,
    level: "info",
    trace: adaptConsoleLog(console.trace),
    debug: adaptConsoleLog(console.debug),
    info: adaptConsoleLog(console.info),
    warn: adaptConsoleLog(console.warn),
    error: adaptConsoleLog(console.error),
    fatal: adaptConsoleLog(console.error),
  };
}
