import { isNullOrUndefined } from "./is-not-null-or-undefined";
import { isObject } from "./is-object";

type KeyValuePredicate<TValue> = (entry: [string, TValue]) => boolean;

/**
 * Keep only properties from the object where the key/value pair matches the predicate condition
 * @param obj The object to filter key/values from
 * @param predicate A function to match key/value pairs upon. Returns true to retain the key/value pair,
 * false to remove it
 */
export function keepProperties<TValue = unknown>(
  obj: Record<string, TValue>,
  predicate: KeyValuePredicate<TValue>,
): Record<string, TValue> {
  return Object.entries(obj).reduce<Record<string, TValue>>((keptProperties, [key, value]) => {
    return predicate([key, value]) ? { ...keptProperties, [key]: value } : keptProperties;
  }, {});
}

/**
 * Remove properties from the object where the key/value pair matches the predicate condition
 * @param obj The object to filter key/values from
 * @param predicate A function to match key/value pairs upon. Returns true to remove the key/value pair,
 * false to keep the pair
 */
export function omitProperties<TValue = unknown>(
  obj: Record<string, TValue>,
  predicate: KeyValuePredicate<TValue>,
): Record<string, TValue> {
  return Object.entries(obj).reduce<Record<string, TValue>>((keptProperties, [key, value]) => {
    return predicate([key, value]) ? keptProperties : { ...keptProperties, [key]: value };
  }, {});
}

export function omitPropertiesByName<TValue = unknown>(
  obj: Record<string, TValue>,
  namesToOmit: string[],
): Record<string, TValue> {
  return omitProperties(obj, ([key]) => namesToOmit.includes(key));
}

/**
 * Remove all properties from the object where value is null or undefined.
 * Note this will type-cast the result to eliminate the null | undefined typing
 * @param obj The object to filter key/values from
 */
export function omitUndefinedAndNullProperties<TValue = unknown>(
  obj: Record<string, TValue | undefined | null>,
): Record<string, TValue> {
  return omitProperties(obj, ([_key, value]) => isNullOrUndefined(value)) as Record<string, TValue>;
}

/** Sometimes, when given an unknown value, it's useful to check if:
 * 1. That value is an object
 * 2. That object contains a given property
 * This is a type-guard that runs that check and narrows the type of the value
 * to an object containing the single known property
 */
export function isObjectWithProperty<TProp = unknown>(
  obj: unknown,
  property: string,
): obj is { [property: string]: TProp } {
  return isObject(obj) && property in obj;
}

/** Using the provided key extractor, convert the list of items into an object.
 * The key of each entry is the result of running the key extractor on the item
 * The value of each entry is the actual item itself
 * @param items The items to map into an object
 * @param keyExtractor A function ran on each item to get the object key for that item
 * @returns The resulting object
 */
export function arrayToObject<TItem>(
  items: TItem[],
  keyExtractor: (item: TItem) => string,
): Record<string, TItem> {
  return items.reduce((asObject, item) => {
    return { ...asObject, [keyExtractor(item)]: item };
  }, {});
}

export function mapObjectValues<TValue, TMappedValue>(
  obj: Record<string, TValue>,
  valueMapper: (key: string, value: TValue) => TMappedValue,
): Record<string, TMappedValue> {
  return Object.entries(obj).reduce((mappedObj, [key, value]) => {
    return { ...mappedObj, [key]: valueMapper(key, value) };
  }, {});
}
