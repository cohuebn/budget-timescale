import {
  Environment,
  envKeyExists,
  getOptional,
  getOptionalBool,
  getRequired,
  getTransformedOptional,
} from "./env";

describe("env", () => {
  afterEach(() => {
    delete process.env.VERSION;
  });
  describe("getRequired", () => {
    it("should return from environment", () => {
      process.env.VERSION = "a good variable value";
      expect(getRequired(Environment.Version)).toEqual("a good variable value");
    });
    it("throw error if not on environment", () => {
      expect(() => getRequired(Environment.Version)).toThrow(
        `${Environment.Version} should be set on the environment`,
      );
    });
  });

  describe("getOptional", () => {
    const defaultValue = "wet bandits";

    it("should return default value when provided", () => {
      expect(getOptional(Environment.Version, "a different value")).toEqual("a different value");
    });

    it("should return undefined when not provided", () => {
      expect(getOptional(Environment.Version)).toEqual(undefined);
    });

    it("should return transformed value when provided", () => {
      process.env.VERSION = "meow!";
      const result = getOptional(Environment.Version, defaultValue);
      expect(result).toEqual("meow!");
    });

    it("should still return empty provided value", () => {
      process.env.VERSION = "";
      const result = getOptional(Environment.Version, defaultValue);
      expect(result).toEqual("");
    });

    it("should return the default value when environment variable not provided", () => {
      const result = getOptional(Environment.Version, defaultValue);
      expect(result).toEqual(defaultValue);
    });
  });

  describe("getTransformedOptional", () => {
    const transformer = (value: string) => value.length;
    const defaultValue = 603;

    it("should return transformed value when provided", () => {
      process.env.VERSION = "meow!";
      expect(getTransformedOptional(Environment.Version, transformer)).toEqual(5);
    });

    it("should still transform empty provided value", () => {
      process.env.VERSION = "";
      expect(getTransformedOptional(Environment.Version, transformer)).toEqual(0);
    });

    it("should return undefined when not provided", () => {
      expect(getTransformedOptional(Environment.Version, transformer)).toEqual(undefined);
    });

    it("should return transformed value when provided", () => {
      process.env.VERSION = "meow!";
      const result = getTransformedOptional(Environment.Version, transformer, defaultValue);
      expect(result).toEqual(5);
    });

    it("should still transform empty provided value", () => {
      process.env.VERSION = "";
      const result = getTransformedOptional(Environment.Version, transformer, defaultValue);
      expect(result).toEqual(0);
    });

    it("should return the default value when environment variable not provided", () => {
      const result = getTransformedOptional(Environment.Version, transformer, defaultValue);
      expect(result).toEqual(defaultValue);
    });
  });

  describe("getOptionalBool", () => {
    const trueValues = ["1", "true", "True", "TRUE", "TrUe"];
    trueValues.forEach((value) => {
      it(`should treat ${value} as true`, () => {
        process.env.BOOLISH = value;
        const result = getOptionalBool("BOOLISH");
        expect(result).toBe(true);
      });
    });

    const falseValues = ["0", "false", "False", "garbaj"];

    falseValues.forEach((value) => {
      it(`should treat ${value} as false`, () => {
        process.env.BOOLISH = value;
        const result = getOptionalBool("BOOLISH");
        expect(result).toBe(false);
      });
    });

    it("should treat an unset value as false", () => {
      const result = getOptionalBool("BOOLISH");
      expect(result).toBe(false);
    });
  });

  describe("envKeyExists", () => {
    it("should return false when key not provided", () => {
      const result = envKeyExists("MICK_JAGGER_SAYS");
      expect(result).toBe(false);
    });

    it("should return true when key provided and truthy", () => {
      process.env.MICK_JAGGER_SAYS = "Mmm, I'm shattered, unh Sha oobie";
      const result = envKeyExists("MICK_JAGGER_SAYS");
      expect(result).toBe(true);
    });

    const falsyCases = ["", "0", "false"];
    falsyCases.forEach((falsyCase) =>
      it(`should return true when key provided and falsy: '${falsyCase}'`, () => {
        process.env.MICK_JAGGER_SAYS = falsyCase;
        const result = envKeyExists("MICK_JAGGER_SAYS");
        expect(result).toBe(true);
      }),
    );
  });
});
