"use client"

import { createWalletClient, custom, getAddress } from "viem"
import type { Address, WalletClient } from "viem"
import { monadTestnet } from "../lib/chain/monad"

export const MONAD_TESTNET_CHAIN_ID = 10143

export function hasEthereum(): boolean {
  return typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined"
}

export async function getWalletClient(): Promise<WalletClient | null> {
  if (!hasEthereum()) return null
  return createWalletClient({
    chain: monadTestnet,
    transport: custom((window as any).ethereum),
  })
}

export async function requestAccounts(): Promise<Address[]> {
  const client = await getWalletClient()
  if (!client) throw new Error("No wallet (window.ethereum) found")
  const accs = (await client.request({ method: "eth_requestAccounts" })) as string[]
  return accs.map((a) => getAddress(a))
}

export async function getChainId(): Promise<number | null> {
  const client = await getWalletClient()
  if (!client) return null
  const id = (await client.request({ method: "eth_chainId" })) as string
  return Number(id)
}

export async function switchOrAddMonad(): Promise<void> {
  const eth = (window as any).ethereum
  if (!eth) throw new Error("No wallet available")
  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x279F" }], // 10143
    })
  } catch (err: any) {
    // Add chain if not found
    if (err?.code === 4902) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x279F",
            chainName: "Monad Testnet",
            nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
            rpcUrls: ["https://testnet-rpc.monad.xyz"],
            blockExplorerUrls: ["https://testnet.monadexplorer.com"],
          },
        ],
      })
    } else {
      throw err
    }
  }
}
