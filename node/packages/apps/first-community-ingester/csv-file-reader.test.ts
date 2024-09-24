import { describe, it, expect } from "vitest";

import { parseFile } from "./csv-file-reader";
import { ParsedCsvRow } from "./types";

describe("parseFile", () => {
  function assertOnRow(
    row: ParsedCsvRow,
    accountName: string,
    transactionNumber: string,
    date: Date,
    description: string,
    memo: string,
    amountDebit: number,
    amountCredit: number,
    balance: number,
    checkNumber?: string,
    fees?: number,
  ) {
    expect(row.accountName).toBe(accountName);
    expect(row.transactionNumber).toBe(transactionNumber);
    expect(row.date).toEqual(date);
    expect(row.description).toBe(description);
    expect(row.memo).toBe(memo);
    expect(row.amountDebit).toBe(amountDebit);
    expect(row.amountCredit).toBe(amountCredit);
    expect(row.balance).toBe(balance);
    expect(row.checkNumber).toEqual(checkNumber);
    expect(row.fees).toEqual(fees);
  }

  it("should return all parsed data rows", async () => {
    const result = await parseFile(`${__dirname}/test-data/fccu-export.csv`);

    expect(result).toHaveLength(4);

    assertOnRow(
      result[0],
      "Primary checking",
      "20240102000000[-6:CST]*1.37*504**FIRST COMMUNITY",
      new Date("2024-01-02"),
      "FIRST COMMUNITY",
      "-RDC DEP : Deposit",
      0.0,
      1.37,
      1056.28,
      undefined,
      0.0,
    );
  });
});
