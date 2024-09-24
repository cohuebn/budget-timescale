import { faker } from "@faker-js/faker";

export function randomString(options: Parameters<typeof faker.word.sample>[0] = {}): string {
  return faker.word.sample(options);
}

export function randomFloat(options: Parameters<typeof faker.number.float>[0] = {}): number {
  return faker.number.float(options);
}

export function randomUsdValue(options: Parameters<typeof faker.finance.amount>[0] = {}): number {
  return parseFloat(faker.finance.amount(options));
}
