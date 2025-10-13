export const MONAD_TESTNET_EXPLORER = "https://testnet.monadexplorer.com"

export function explorerTxUrl(txHash: `0x${string}`, base = MONAD_TESTNET_EXPLORER) {
  return `${base}/tx/${txHash}`
}

export function explorerAddressUrl(addr: `0x${string}`, base = MONAD_TESTNET_EXPLORER) {
  return `${base}/address/${addr}`
}
