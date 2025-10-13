import { createPublicClient, http, isAddress, getAddress } from "viem"
import type { Address } from "viem"
import { monadTestnet } from "./chain/monad"

export function getPublicClient() {
  return createPublicClient({
    chain: monadTestnet as any,
    transport: http(monadTestnet.rpcUrls.default.http[0]),
  })
}

export function toChecksum(addr: string): Address {
  if (!isAddress(addr)) throw new Error("Invalid address")
  return getAddress(addr)
}

export function explorerTxUrl(txHash: string): string {
  return `${monadTestnet.blockExplorers.default.url}/tx/${txHash}`
}

export function explorerAddressUrl(addr: string): string {
  return `${monadTestnet.blockExplorers.default.url}/address/${addr}`
}
