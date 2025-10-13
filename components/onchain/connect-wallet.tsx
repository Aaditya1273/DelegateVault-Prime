"use client"

import { useWallet } from "../../hooks/use-wallet"

export default function ConnectWallet() {
  const { hasProvider, address, isOnMonad, connecting, connect } = useWallet()

  return (
    <div className="rounded-lg border p-4 bg-background">
      <h3 className="text-lg font-semibold">Wallet</h3>
      {!hasProvider ? (
        <p className="text-sm text-muted-foreground">
          No wallet detected. Please install a wallet with window.ethereum support.
        </p>
      ) : address ? (
        <div className="text-sm">
          <div>
            Address: <span className="font-mono">{address}</span>
          </div>
          <div className={isOnMonad ? "text-green-600" : "text-red-600"}>
            Network: {isOnMonad ? "Monad Testnet" : "Wrong network — click Connect to switch"}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Not connected.</p>
      )}
      <div className="mt-3">
        <button
          className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
          onClick={connect}
          disabled={connecting}
        >
          {connecting ? "Connecting…" : "Connect / Switch to Monad"}
        </button>
      </div>
    </div>
  )
}
