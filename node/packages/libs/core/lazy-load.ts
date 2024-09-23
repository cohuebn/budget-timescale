import { isNullOrUndefined } from "./is-not-null-or-undefined";

export function lazyLoad<T>(getValue: () => T) {
  let value: T;
  return () => {
    if (isNullOrUndefined(value)) {
      value = getValue();
    }
    return value;
  };
}
