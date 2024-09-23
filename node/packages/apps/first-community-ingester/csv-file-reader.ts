import { readFile } from "fs/promises";

import { parse as parseDate, parseISO } from "date-fns";
import { parse as parseCsv } from "papaparse";
import { isNullOrUndefined } from "@budget-timescale/core";

import { ParsedCsvRow, RawCsvRow } from "./types";

const accountNamePattern = /Account Name : (?<accountName>[\w|\s]+)/;

function getAccountName(line: string): string {
  const match = line.match(accountNamePattern);
  const accountName = match?.groups?.accountName;
  if (isNullOrUndefined(accountName)) {
    throw new Error("Could not find account name in header row");
  }
  return accountName;
}

const headerMappings: Map<string, string> = new Map([
  ["Transaction Number", "transactionNumber"],
  ["Date", "date"],
  ["Description", "description"],
  ["Memo", "memo"],
  ["Amount Debit", "amountDebit"],
  ["Amount Credit", "amountCredit"],
  ["Balance", "balance"],
  ["Check Number", "checkNumber"],
  ["Fees", "fees"],
]);
/** Convert the raw headers from the csv into field names on our type */
function transformHeader(header: string): string {
  return headerMappings.get(header) ?? header;
}

function parseOptionalCsvNumber(value: undefined | null | string | number): number {
  if (isNullOrUndefined(value) || value === "") return 0.0;
  return typeof value === "string" ? parseFloat(value) : value;
}

const templateDate = parseISO("2024-01-01T00:00:00.000Z");

/**
 * Read a First Community Credit Union CSV export and return the raw
 * spend data
 */
export async function parseFile(filepath: string): Promise<ParsedCsvRow[]> {
  const contents = await readFile(filepath, "utf-8");
  const fileLines = contents.split("\n");
  const accountName = getAccountName(fileLines[0]);
  // The first four lines are metadata (account name, number, date range) and the header row for the data
  const dataRows = fileLines.slice(3);
  const { data, errors } = parseCsv<RawCsvRow>(dataRows.join("\n"), {
    header: true,
    transformHeader,
  });
  if (errors.length) {
    throw new Error(`Error parsing CSV at ${filepath}: ${errors}`);
  }
  return data.map((x) => ({
    ...x,
    accountName,
    // Use UTC time values for the time fields
    date: parseDate(`${x.date}T00:00:00.000Z`, "MM/dd/yyyy'T'HH:mm:ss.SSSX", templateDate),
    amountCredit: parseOptionalCsvNumber(x.amountCredit),
    amountDebit: parseOptionalCsvNumber(x.amountDebit),
    balance: parseOptionalCsvNumber(x.balance),
    fees: parseOptionalCsvNumber(x.fees),
    checkNumber: x.checkNumber === "" ? undefined : x.checkNumber,
  }));
}
