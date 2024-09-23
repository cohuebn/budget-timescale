create table if not exists ${flyway:defaultSchema}.actual_spend (
  account_name text,
  transaction_number text,
  transaction_date timestamptz,
  description text,
  memo text,
  amount money,
  fees money
);

select create_hypertable('${flyway:defaultSchema}.actual_spend', by_range('transaction_date'), if_not_exists => true);

create index if not exists actual_spend_search_idx
  on actual_spend using gin (to_tsvector('english', description || ' ' || memo));