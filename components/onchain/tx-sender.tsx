"use client"

import { useState } from "react"
import type { Address } from "viem"
import { getWalletClient } from "../../lib/wallet"
import { getPublicClient } from "../../lib/viem"
import { erc20Abi } from "../../lib/abi/erc20"
import { erc4626Abi } from "../../lib/abi/erc4626"
import { explorerTxUrl } from "../../lib/explorer"

type Props = {
  vaultAddress: Address
}

export default function TxSender({ vaultAddress }: Props) {
  const [assetAddress, setAssetAddress] = useState<Address | null>(null)
  const [amount, setAmount] = useState<string>("0")
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState<"approve" | "deposit" | "redeem" | null>(null)

  async function ensureAssetAddress(): Promise<Address> {
    if (assetAddress) return assetAddress
    const pc = getPublicClient()
    const addr = (await pc.readContract({
      address: vaultAddress,
      abi: erc4626Abi,
      functionName: "asset",
    })) as Address
    setAssetAddress(addr)
    return addr
  }

  async function sendApprove() {
    setError(null)
    setTxHash(null)
    setPending("approve")
    try {
      const asset = await ensureAssetAddress()
      const wc = await getWalletClient()
      if (!wc) throw new Error("Wallet not available")
      const hash = await wc.writeContract({
        address: asset,
        abi: erc20Abi,
        functionName: "approve",
        args: [vaultAddress, BigInt(amount)],
      })
      setTxHash(hash)
    } catch (e: any) {
      setError(e?.message || String(e))
    } finally {
      setPending(null)
    }
  }

  async function sendDeposit() {
    setError(null)
    setTxHash(null)
    setPending("deposit")
    try {
      const wc = await getWalletClient()
      if (!wc) throw new Error("Wallet not available")
      const hash = await wc.writeContract({
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: "deposit",
        args: [BigInt(amount), wc.account!.address as Address],
      })
      setTxHash(hash)
    } catch (e: any) {
      setError(e?.message || String(e))
    } finally {
      setPending(null)
    }
  }

  async function sendRedeem() {
    setError(null)
    setTxHash(null)
    setPending("redeem")
    try {
      const wc = await getWalletClient()
      if (!wc) throw new Error("Wallet not available")
      const hash = await wc.writeContract({
        address: vaultAddress,
        abi: erc4626Abi,
        functionName: "redeem",
        args: [BigInt(amount), wc.account!.address as Address, wc.account!.address as Address],
      })
      setTxHash(hash)
    } catch (e: any) {
      setError(e?.message || String(e))
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="rounded-lg border p-4 bg-background">
      <h3 className="text-lg font-semibold">Send Transactions</h3>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label className="text-sm">Amount (raw units)</label>
          <input
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 1000000000000000000"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Enter raw token units (e.g., 1e18 for 1 token if 18 decimals).
          </p>
        </div>
        <div className="flex items-end gap-2">
          <button
            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
            onClick={sendApprove}
            disabled={pending !== null}
          >
            {pending === "approve" ? "Approving…" : "Approve"}
          </button>
          <button
            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
            onClick={sendDeposit}
            disabled={pending !== null}
          >
            {pending === "deposit" ? "Depositing…" : "Deposit"}
          </button>
          <button
            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
            onClick={sendRedeem}
            disabled={pending !== null}
          >
            {pending === "redeem" ? "Redeeming…" : "Redeem"}
          </button>
        </div>
      </div>

      {txHash && (
        <div className="mt-3 text-sm">
          Sent:{" "}
          <a className="text-blue-600 underline" href={explorerTxUrl(txHash)} target="_blank" rel="noreferrer">
            {txHash}
          </a>
        </div>
      )}
      {error && <div className="mt-3 text-sm text-red-600">Error: {error}</div>}
    </div>
  )
}
