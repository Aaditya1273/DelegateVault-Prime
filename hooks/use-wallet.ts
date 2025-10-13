"use client"

import { useCallback, useEffect, useState } from "react"
import type { Address } from "viem"
import { hasEthereum, requestAccounts, getChainId, switchOrAddMonad, MONAD_TESTNET_CHAIN_ID } from "../lib/wallet"

export function useWallet() {
  const [hasProvider, setHasProvider] = useState(false)
  const [address, setAddress] = useState<Address | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    setHasProvider(hasEthereum())
    const eth = (window as any).ethereum
    if (!eth) return
    const handleAccountsChanged = (accs: string[]) => setAddress((accs?.[0] as Address) || null)
    const handleChainChanged = async () => setChainId(await getChainId())
    eth.on?.("accountsChanged", handleAccountsChanged)
    eth.on?.("chainChanged", handleChainChanged)
    ;(async () => setChainId(await getChainId()))()
    return () => {
      eth.removeListener?.("accountsChanged", handleAccountsChanged)
      eth.removeListener?.("chainChanged", handleChainChanged)
    }
  }, [])

  const connect = useCallback(async () => {
    setConnecting(true)
    try {
      await switchOrAddMonad()
      const accs = await requestAccounts()
      setAddress(accs[0] || null)
      setChainId(await getChainId())
    } finally {
      setConnecting(false)
    }
  }, [])

  const isOnMonad = chainId === MONAD_TESTNET_CHAIN_ID

  return { hasProvider, address, chainId, isOnMonad, connecting, connect }
}
