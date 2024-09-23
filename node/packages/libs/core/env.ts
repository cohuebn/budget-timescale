import { isNotNullOrUndefined } from "./is-not-null-or-undefined";

export function getRequired(envVar: string): string {
  const value = process.env[envVar];
  if (typeof value === "undefined") {
    throw new Error(`${envVar} should be set on the environment`);
  }
  return value;
}

export function getOptional(envVar: string): undefined | string;
export function getOptional(envVar: string, defaultValue: string): string;
export function getOptional(envVar: string, defaultValue?: string) {
  return process.env[envVar] ?? defaultValue;
}

export function getTransformedOptional<T>(
  envVar: string,
  transformer: (value: string) => T,
): undefined | T;
export function getTransformedOptional<T>(
  envVar: string,
  transformer: (value: string) => T,
  defaultValue: T,
): T;
export function getTransformedOptional<T>(
  envVar: string,
  transformer: (value: string) => T,
  defaultValue?: T,
) {
  const value = getOptional(envVar);
  return isNotNullOrUndefined(value) ? transformer(value) : defaultValue;
}

/**
 * Get an environment variable representing a boolean. It treats the following as true
 * 1. The string "1"
 * 2. Any casing of the string "true"
 *
 * If the env var isn't found, it is treated as false
 */
export function getOptionalBool(envVar: string): boolean {
  const stringValue = getTransformedOptional(envVar, (x) => x.toLowerCase());
  return stringValue === "1" || stringValue === "true";
}

/**
 * Get an environment variable representing an int
 * @returns The int-parsed value of the environment variable
 */
export function getOptionalInt(envVar: string, defaultValue: number): number {
  return getTransformedOptional(envVar, (x) => parseInt(x, 10)) ?? defaultValue;
}

export function envKeyExists(name: string): boolean {
  return name in process.env;
}

export enum Environment {
  Version = "VERSION",
  LogLevel = "LOG_LEVEL",
  FreeTierKeyValue = "FREE_TIER_KEY_VALUE",
  FreeTierName = "FREE_TIER_NAME",
  OrganizationTable = "ORGANIZATION_TABLE_NAME",
}
