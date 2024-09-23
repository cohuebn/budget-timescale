/**
 * This is a type-guard that checks if the provided value is a plain-old-object.
 * Note this is not the Javascript "object" type which also includes arrays
 * and null. This is purely for key/value pair objects
 * @param value The value to check for object-ness
 * @returns True if the value is an object, false otherwise
 */
export function isObject<T = unknown>(value: unknown): value is Record<string, T> {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}
