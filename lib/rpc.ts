export function getChainId(): number {
  return Number(process.env.NEXT_PUBLIC_CHAIN_ID || 0)
}

export function getRpcUrl(): string {
  const url = process.env.RPC_URL || ""
  if (!url) {
    console.warn("[v0] RPC_URL not set; onchain calls will be disabled.")
  }
  return url
}

export function getExplorerBase(): string {
  return process.env.NEXT_PUBLIC_EXPLORER_BASE || ""
}
