-- add columns to vaults for parity with in-memory storage and API shape
ALTER TABLE IF EXISTS vaults
  ADD COLUMN IF NOT EXISTS tvl NUMERIC NULL,
  ADD COLUMN IF NOT EXISTS total_shares NUMERIC NULL,
  ADD COLUMN IF NOT EXISTS fee_bps INTEGER NULL,
  ADD COLUMN IF NOT EXISTS total_assets NUMERIC NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- positions by account snapshots (per-account, per-vault, time-series)
CREATE TABLE IF NOT EXISTS positions_by_account (
  vault TEXT NOT NULL,
  account TEXT NOT NULL,
  shares NUMERIC NOT NULL,
  assets NUMERIC NOT NULL,
  ts TIMESTAMP NOT NULL,
  PRIMARY KEY (vault, account, ts)
);

-- helpful indexes for query performance
CREATE INDEX IF NOT EXISTS vault_events_address_idx ON vault_events(address);
CREATE INDEX IF NOT EXISTS delegations_owner_idx ON delegations(vault_owner);
CREATE INDEX IF NOT EXISTS positions_by_account_vault_idx ON positions_by_account(vault);
CREATE INDEX IF NOT EXISTS positions_by_account_account_idx ON positions_by_account(account);

-- optional status index for jobs table
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
