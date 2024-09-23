import { isObject } from "./is-object";

describe("isObject", () => {
  const nonObjects = [null, undefined, 1, true, "abc", ["obviously", "not", "an", "object"]];
  nonObjects.forEach((nonObject: unknown) => {
    it(`should return false for non-objects: ${nonObject}`, () => {
      expect(isObject(nonObject)).toBe(false);
    });
  });

  it("should return true for an empty object", () => {
    const value: unknown = {};
    expect(isObject(value)).toBe(true);
    // Ensure type-guard allows TS compilation
    if (isObject(value)) {
      expect(Object.keys(value)).toEqual([]);
    }
  });

  it("should return true for a populated object", () => {
    const value: unknown = {
      jerome: "bettis",
      eats: {
        chunky: "campbells soup",
        hooray: true,
      },
    };
    expect(isObject(value)).toBe(true);
    // Ensure type-guard allows TS compilation
    if (isObject(value)) {
      expect(Object.keys(value)).toEqual(["jerome", "eats"]);
    }
  });
});
