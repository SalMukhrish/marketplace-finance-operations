-- Simplified public reference schema for the Marketplace Finance Operations model.
-- This file is explanatory and is not a production migration dump.

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  total_minor BIGINT NOT NULL CHECK (total_minor > 0),
  status TEXT NOT NULL CHECK (status IN ('issued', 'cancelled')),
  issued_at TIMESTAMPTZ NOT NULL,
  UNIQUE (order_id, id)
);

CREATE TABLE collections (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL REFERENCES invoices(id),
  captured_minor BIGINT NOT NULL CHECK (captured_minor > 0),
  status TEXT NOT NULL CHECK (status IN ('captured', 'failed')),
  captured_at TIMESTAMPTZ,
  UNIQUE (invoice_id, id)
);

CREATE TABLE journal_entries (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL REFERENCES invoices(id),
  event_key TEXT NOT NULL,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (invoice_id, event_key)
);

CREATE TABLE journal_lines (
  id TEXT PRIMARY KEY,
  journal_entry_id TEXT NOT NULL REFERENCES journal_entries(id),
  account_code TEXT NOT NULL,
  debit_minor BIGINT NOT NULL DEFAULT 0 CHECK (debit_minor >= 0),
  credit_minor BIGINT NOT NULL DEFAULT 0 CHECK (credit_minor >= 0),
  CHECK (
    (debit_minor > 0 AND credit_minor = 0) OR
    (credit_minor > 0 AND debit_minor = 0)
  )
);

CREATE TABLE refunds (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL REFERENCES invoices(id),
  amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
  status TEXT NOT NULL CHECK (status IN ('pending', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (invoice_id, id)
);

CREATE TABLE settlements (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL UNIQUE REFERENCES invoices(id),
  merchant_due_minor BIGINT NOT NULL CHECK (merchant_due_minor >= 0),
  status TEXT NOT NULL CHECK (status IN ('pending', 'settled', 'blocked')),
  settled_at TIMESTAMPTZ
);

CREATE TABLE reconciliation_results (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL REFERENCES invoices(id),
  captured_clearing_minor BIGINT NOT NULL CHECK (captured_clearing_minor >= 0),
  bank_deposit_minor BIGINT NOT NULL CHECK (bank_deposit_minor >= 0),
  gateway_fee_minor BIGINT NOT NULL CHECK (gateway_fee_minor >= 0),
  difference_minor BIGINT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('matched', 'exception')),
  reviewed_at TIMESTAMPTZ,
  UNIQUE (invoice_id, id)
);
