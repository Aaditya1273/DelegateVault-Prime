export type Vault = {
  address: string
  chainId: number
  name: string
  assetSymbol: string
  tvl: number | null
  totalShares: number | null
  feeBps?: number | null
  totalAssets?: number | null
  updatedAt?: number
}

export type DelegationPolicy = {
  vaultOwner: string
  delegate: string
  expiresAt: number
  // optional fields for future signature validation
  sig?: string
  nonce?: string
  createdAt?: number
  updatedAt?: number
}

export type VaultEvent = {
  id: string // blockNumber:txIndex:logIndex
  address: string
  blockNumber: number
  transactionHash: string
  transactionIndex: number
  logIndex: number
  topics: string[]
  data: string
  createdAt?: number
}

export type PositionSnapshot = {
  vault: string
  account: string
  shares: string
  assets: string
  ts: number
}

export interface StorageAdapter {
  // vaults
  upsertVault(v: Vault): Promise<void>
  hasVault(address: string): boolean
  getVault(address: string): Promise<Vault | null>
  listVaults(): Promise<Vault[]>

  // delegations
  upsertDelegation(d: DelegationPolicy): Promise<void>
  listDelegationsByOwner(owner: string): Promise<DelegationPolicy[]>

  // events
  addEvent(e: VaultEvent): Promise<boolean> // returns false if already existed (idempotent)
  listEvents(address?: string): Promise<VaultEvent[]>

  // positions
  addPositionSnapshot(p: PositionSnapshot): Promise<void>
  listPositions(vault: string): Promise<PositionSnapshot[]>
}

function keyAddr(a: string) {
  return a.toLowerCase()
}

class InMemoryStorage implements StorageAdapter {
  private vaults = new Map<string, Vault>() // key: address
  private delegations = new Map<string, DelegationPolicy[]>() // key: owner
  private events = new Map<string, VaultEvent>() // key: id
  private positions = new Map<string, PositionSnapshot[]>() // key: vault

  async upsertVault(v: Vault): Promise<void> {
    const k = keyAddr(v.address)
    const now = Date.now()
    this.vaults.set(k, { ...v, updatedAt: now })
  }

  hasVault(address: string): boolean {
    return this.vaults.has(keyAddr(address))
  }

  async getVault(address: string): Promise<Vault | null> {
    return this.vaults.get(keyAddr(address)) ?? null
  }

  async listVaults(): Promise<Vault[]> {
    return Array.from(this.vaults.values())
  }

  async upsertDelegation(d: DelegationPolicy): Promise<void> {
    const owner = keyAddr(d.vaultOwner)
    const list = this.delegations.get(owner) ?? []
    const now = Date.now()
    const withoutSame = list.filter((x) => keyAddr(x.delegate) !== keyAddr(d.delegate))
    withoutSame.push({ ...d, createdAt: d.createdAt ?? now, updatedAt: now })
    this.delegations.set(owner, withoutSame)
  }

  async listDelegationsByOwner(owner: string): Promise<DelegationPolicy[]> {
    return this.delegations.get(keyAddr(owner)) ?? []
  }

  async addEvent(e: VaultEvent): Promise<boolean> {
    if (this.events.has(e.id)) return false
    this.events.set(e.id, { ...e, createdAt: e.createdAt ?? Date.now() })
    return true
  }

  async listEvents(address?: string): Promise<VaultEvent[]> {
    const all = Array.from(this.events.values())
    if (!address) return all
    const k = keyAddr(address)
    return all.filter((e) => keyAddr(e.address) === k)
  }

  async addPositionSnapshot(p: PositionSnapshot): Promise<void> {
    const k = keyAddr(p.vault)
    const arr = this.positions.get(k) ?? []
    arr.push(p)
    this.positions.set(k, arr)
  }

  async listPositions(vault: string): Promise<PositionSnapshot[]> {
    return this.positions.get(keyAddr(vault)) ?? []
  }
}

// Singleton adapter export
const singleton = new InMemoryStorage()
export const storage: StorageAdapter = singleton

// Optional seeding helper from env for single-vault demos
export async function seedVaultFromEnv() {
  const envVault = process.env.NEXT_PUBLIC_DELEGATE_VAULT_ADDRESS
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 0)
  if (envVault && !singleton.hasVault(envVault)) {
    await singleton.upsertVault({
      address: envVault,
      chainId,
      name: "DelegateVault",
      assetSymbol: "ETH/ERC20",
      tvl: null,
      totalShares: null,
      feeBps: null,
      totalAssets: null,
    })
  }
}
