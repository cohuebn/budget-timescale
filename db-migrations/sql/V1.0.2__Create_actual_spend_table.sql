create table if not exists ${flyway:defaultSchema}.actual_spend (
  transaction_number text,
  transaction_date timestamptz,
  description text,
  memo text,
  amount money,
  fees money
);