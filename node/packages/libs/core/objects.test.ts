import {
  isObjectWithProperty,
  keepProperties,
  omitProperties,
  omitPropertiesByName,
  omitUndefinedAndNullProperties,
  arrayToObject,
  mapObjectValues,
} from "./objects";

describe("object functions", () => {
  describe("keepProperties", () => {
    it("should keep properties when predicate met, remove when not met", () => {
      const obj: Record<string, number> = { a: 1, b: 2, c: 3 };
      const result = keepProperties(obj, ([_key, value]) => value > 1);
      expect(result).not.toHaveProperty("a");
      expect(result).toHaveProperty("b", 2);
      expect(result).toHaveProperty("c", 3);
    });

    it("should handle an empty object", () => {
      const result = keepProperties<number>({}, ([_key, value]) => value > 1);
      expect(result).toEqual({});
    });
  });

  describe("omitProperties", () => {
    it("should remove properties when predicate met, keep when not met", () => {
      const obj: Record<string, number> = { a: 1, b: 2, c: 3 };
      const result = omitProperties(obj, ([_key, value]) => value > 1);
      expect(result).toHaveProperty("a", 1);
      expect(result).not.toHaveProperty("b");
      expect(result).not.toHaveProperty("c");
    });

    it("should handle an empty object", () => {
      const result = omitProperties<number>({}, ([_key, value]) => value > 1);
      expect(result).toEqual({});
    });
  });

  describe("omitPropertiesByName", () => {
    it("should remove properties when name matched, keep when not matched", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omitPropertiesByName(obj, ["b", "c", "g"]);
      expect(result).toHaveProperty("a", 1);
      expect(result).not.toHaveProperty("b");
      expect(result).not.toHaveProperty("c");
    });

    it("should handle an empty object", () => {
      const result = omitPropertiesByName<number>({}, ["a"]);
      expect(result).toEqual({});
    });
  });

  describe("omitUndefinedAndNullProperties", () => {
    it("should remove properties with null and undefined values", () => {
      const obj: Record<string, number | undefined | null> = { a: undefined, b: 2, c: null };
      const result = omitUndefinedAndNullProperties(obj);
      expect(result).not.toHaveProperty("a");
      expect(result).toHaveProperty("b", 2);
      expect(result).not.toHaveProperty("c");
    });

    it("should handle an empty object", () => {
      const result = omitUndefinedAndNullProperties<number>({});
      expect(result).toEqual({});
    });
  });

  describe("isObjectWithProperty", () => {
    it("should return true and narrow type when object contains property", () => {
      const obj: unknown = { a: undefined, b: 2 };
      expect(isObjectWithProperty(obj, "b")).toBe(true);
      if (isObjectWithProperty<number>(obj, "b")) {
        expect(obj.b).toBe(2);
      }
    });

    it("should return true and narrow type when object contains property even if prop value is undefined", () => {
      const obj: unknown = { a: undefined, b: 2 };
      expect(isObjectWithProperty(obj, "a")).toBe(true);
      if (isObjectWithProperty(obj, "a")) {
        expect(obj.a).toBeUndefined();
      }
    });

    it("should return false when value is not an object", () => {
      expect(isObjectWithProperty(123, "a")).toBe(false);
    });

    it("should return false when object does not contain property", () => {
      expect(isObjectWithProperty({ b: 1 }, "a")).toBe(false);
    });
  });

  describe("arrayToObject", () => {
    type TestObject = { name: string };

    it("should handle an empty list", () => {
      const result = arrayToObject<TestObject>([], (x) => x.name);
      expect(result).toEqual({});
    });

    it("should create an object using each item and it's corresponding key", () => {
      const [item1, item2, item3] = [{ name: "foofa" }, { name: "gooble" }, { name: "bizMarkie" }];
      const result = arrayToObject<TestObject>([item2, item1, item3], (x) => x.name);
      expect(Object.keys(result)).toHaveLength(3);
      expect(result.foofa).toEqual(item1);
      expect(result.gooble).toEqual(item2);
      expect(result.bizMarkie).toEqual(item3);
    });
  });

  describe("mapObjectValues", () => {
    it("should handle an empty object", () => {
      const result = mapObjectValues<string, number>({}, (_, value) => value.length);
      expect(result).toEqual({});
    });

    it("should run the mapper on each object value", () => {
      const original = {
        how: "now",
        brown: "cowz",
      };
      const result = mapObjectValues<string, number>(original, (_, value) => value.length);
      expect(Object.keys(result)).toHaveLength(2);
      expect(result.how).toEqual(3);
      expect(result.brown).toEqual(4);
    });
  });
});
