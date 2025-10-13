-- vaults
CREATE TABLE IF NOT EXISTS vaults (
  address TEXT PRIMARY KEY,
  chain_id INTEGER NOT NULL,
  name TEXT,
  asset_symbol TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- vault events (idempotency via block/tx/log triple)
CREATE TABLE IF NOT EXISTS vault_events (
  block_number BIGINT NOT NULL,
  tx_index INTEGER NOT NULL,
  log_index INTEGER NOT NULL,
  address TEXT NOT NULL,
  event_name TEXT NOT NULL,
  args JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (block_number, tx_index, log_index)
);

-- delegations
CREATE TABLE IF NOT EXISTS delegations (
  vault_owner TEXT NOT NULL,
  delegate TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (vault_owner, delegate)
);

-- position snapshots (aggregated balances over time)
CREATE TABLE IF NOT EXISTS position_snapshots (
  address TEXT NOT NULL,
  snapshot_at TIMESTAMP NOT NULL,
  total_assets NUMERIC,
  total_shares NUMERIC,
  meta JSONB,
  PRIMARY KEY (address, snapshot_at)
);

-- jobs (keeper runs)
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  payload JSONB,
  status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
