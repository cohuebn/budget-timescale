import { describe, it, expect } from "vitest";

import { randomString, randomUsdValue } from "@budget-timescale/testing";

import { toActualSpend } from "./actual-spend";
import { ParsedCsvRow } from "./types";

describe("toActualSpend", () => {
  function createTestCase(data: Partial<ParsedCsvRow> = {}): ParsedCsvRow {
    return {
      accountName: data.accountName ?? randomString(),
      transactionNumber: data.transactionNumber ?? randomString(),
      date: data.date ?? new Date(),
      description: data.description ?? randomString(),
      memo: data.memo ?? randomString(),
      amountDebit: data.amountDebit ?? randomUsdValue({ min: -100, max: 0 }),
      amountCredit: data.amountCredit ?? randomUsdValue({ min: 0, max: 100 }),
      balance: data.balance ?? randomUsdValue(),
      fees: data.fees ?? 0.0,
    };
  }

  it("should convert one-to-one fields", () => {
    const testCase = createTestCase();

    const result = toActualSpend(testCase);

    expect(result.accountName).toBe(testCase.accountName);
    expect(result.transactionNumber).toBe(testCase.transactionNumber);
    expect(result.transactionDate).toEqual(testCase.date);
    expect(result.description).toBe(testCase.description);
    expect(result.memo).toBe(testCase.memo);
    expect(result.fees).toBe(testCase.fees);
  });

  it("should handle just a credit", () => {
    const testCase = createTestCase({ amountCredit: 1.05, amountDebit: 0 });

    const result = toActualSpend(testCase);

    expect(result.amount).toBe(1.05);
  });

  it("should handle just a debit", () => {
    const testCase = createTestCase({ amountCredit: 0, amountDebit: -1.05 });

    const result = toActualSpend(testCase);

    expect(result.amount).toBe(-1.05);
  });

  it("should handle both a debit and credit", () => {
    const testCase = createTestCase({ amountCredit: 3.5, amountDebit: -1.05 });

    const result = toActualSpend(testCase);

    expect(result.amount).toBe(2.45);
  });
});
