import { createHash } from "crypto";

/**
 * Create a key for the given fields using a standard hashing mechanism. This is
 * useful for getting a deterministic primary key within our databases.
 * @param fields The fields to hash as an array; an array is used to ensure ordering of keys
 * @return The hash of the provided keys
 */
export function toHashedKey(fields: unknown[]): string {
  return createHash("sha256").update(fields.join(":")).digest("base64");
}
