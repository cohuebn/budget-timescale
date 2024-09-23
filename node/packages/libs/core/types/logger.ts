import { LogFn } from "pino";

export type LogCall = (obj: unknown, message?: string) => void;

export type Logger = {
  name?: string | LogFn;
  level?: string;
  trace: LogCall;
  debug: LogCall;
  info: LogCall;
  warn: LogCall;
  error: LogCall;
  fatal: LogCall;
};
