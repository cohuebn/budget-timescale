type CsvOptionalNumber = string | number;

export type RawCsvRow = {
  accountName: string;
  transactionNumber: string;
  date: string;
  description: string;
  memo: string;
  amountDebit: CsvOptionalNumber;
  amountCredit: CsvOptionalNumber;
  balance: CsvOptionalNumber;
  checkNumber: string | undefined;
  fees: CsvOptionalNumber;
};

export type ParsedCsvRow = {
  accountName: string;
  transactionNumber: string;
  date: Date;
  description: string;
  memo: string;
  amountDebit: number;
  amountCredit: number;
  balance: number;
  checkNumber?: string;
  fees: number;
};

export type ActualSpend = {
  accountName: string;
  transactionNumber: string;
  transactionDate: Date;
  description: string;
  memo: string;
  amount: number;
  fees: number;
};
