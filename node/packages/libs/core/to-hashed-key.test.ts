import { toHashedKey } from "./to-hashed-key";

describe("toHashedKey", () => {
  const expectedHashLength = 44;

  it("should provide a deterministic key for the same inputs", () => {
    const fieldSet = ["a", 1, new Date("1987-07-21T01:02:03Z")];
    const hash1 = toHashedKey(fieldSet);
    const hash2 = toHashedKey([...fieldSet]);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(expectedHashLength);
  });

  it("should not match key on different inputs", () => {
    const originalDate = new Date("1987-07-21T01:02:03Z");
    const originalFieldSet = ["a", 1, originalDate];
    const hash1 = toHashedKey(originalFieldSet);
    const updatedFieldSet = [
      originalFieldSet[0],
      originalFieldSet[1],
      new Date("1987-07-21T01:02:04Z"),
    ];
    const hash2 = toHashedKey(updatedFieldSet);

    expect(hash1).not.toEqual(hash2);
    expect(hash1).toHaveLength(expectedHashLength);
    expect(hash2).toHaveLength(expectedHashLength);
  });

  it("should not match key on differing fields inputs", () => {
    const fieldSet1 = ["a", 1, new Date("1987-07-21T01:02:04Z")];
    const hash1 = toHashedKey(fieldSet1);
    const hash2 = toHashedKey([...fieldSet1, "another-thing"]);

    expect(hash1).not.toEqual(hash2);
    expect(hash1).toHaveLength(expectedHashLength);
    expect(hash2).toHaveLength(expectedHashLength);
  });
});
