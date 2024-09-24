import { ActualSpend, ParsedCsvRow } from "./types";

export function toActualSpend(csvRow: ParsedCsvRow): ActualSpend {
  return {
    accountName: csvRow.accountName,
    transactionNumber: csvRow.transactionNumber,
    transactionDate: csvRow.date,
    description: csvRow.description,
    memo: csvRow.memo,
    // Addition on purpose here because amountCredit is always negative; we're trying to determine
    // impact on balance (debit adds to balance, credit subtracts)
    amount: csvRow.amountDebit + csvRow.amountCredit,
    fees: csvRow.fees,
  };
}
