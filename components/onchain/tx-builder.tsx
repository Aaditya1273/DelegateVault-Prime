"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { parseUnits } from "viem"
import { fetcher } from "@/lib/swr"

type Meta = {
  vault: string
  asset: string
  assetSymbol: string
  assetDecimals: number
  totalAssets: string
  totalSupply: string
}

export default function TxBuilderComponent({ address }: { address: string }) {
  const { data: meta, error } = useSWR<Meta>(`/api/onchain/vaults/${address}/metadata`, fetcher, {
    refreshInterval: 15000,
  })
  const [amount, setAmount] = useState("")
  const [receiver, setReceiver] = useState("")
  const [owner, setOwner] = useState("")
  const [result, setResult] = useState<any>(null)
  const [busy, setBusy] = useState(false)

  const decimals = meta?.assetDecimals ?? 18
  const amountWei = useMemo(() => {
    try {
      if (!amount) return null
      return parseUnits(amount, decimals).toString()
    } catch {
      return null
    }
  }, [amount, decimals])

  async function postJson<T>(url: string, body: any): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "cache-control": "no-store" },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(typeof data?.error === "string" ? data.error : res.statusText)
    }
    return data as T
  }

  async function buildApprove() {
    if (!meta || !amountWei) return
    setBusy(true)
    try {
      const payload = await postJson("/api/onchain/tx/approve", {
        token: meta.asset,
        spender: meta.vault,
        amount: amountWei,
      })
      setResult(payload)
    } catch (e: any) {
      setResult({ error: e.message })
    } finally {
      setBusy(false)
    }
  }

  async function buildDeposit() {
    if (!meta || !amountWei) return
    setBusy(true)
    try {
      const payload = await postJson("/api/onchain/tx/build", {
        action: "deposit",
        vault: meta.vault,
        amount: amountWei,
        receiver: receiver || undefined,
      })
      setResult(payload)
    } catch (e: any) {
      setResult({ error: e.message })
    } finally {
      setBusy(false)
    }
  }

  async function buildWithdraw() {
    if (!meta || !amountWei) return
    setBusy(true)
    try {
      const payload = await postJson("/api/onchain/tx/build", {
        action: "withdraw",
        vault: meta.vault,
        amount: amountWei, // withdraw in assets as per ERC-4626
        receiver: receiver || undefined,
        owner: owner || undefined,
      })
      setResult(payload)
    } catch (e: any) {
      setResult({ error: e.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="border rounded-md p-4 space-y-4">
      <h2 className="text-lg font-medium">Build Transaction</h2>

      {!meta && !error && <p className="text-sm text-muted-foreground">Loading metadata…</p>}
      {error && <p className="text-sm text-destructive">Failed to load metadata</p>}
      {meta && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Amount ({meta.assetSymbol})</label>
              <input
                className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
                placeholder={`0.0 ${meta.assetSymbol}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Decimals: {meta.assetDecimals}. Parsed: {amountWei ?? "—"} wei
              </p>
            </div>
            <div>
              <label className="block text-sm mb-1">Receiver (optional)</label>
              <input
                className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
                placeholder="0x…"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
              />
              <label className="block text-sm mt-3 mb-1">Owner (withdraw only, optional)</label>
              <input
                className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
                placeholder="0x…"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="px-3 py-2 rounded-md bg-secondary text-secondary-foreground"
              onClick={buildApprove}
              disabled={!amountWei || busy}
            >
              Build Approve
            </button>
            <button
              className="px-3 py-2 rounded-md bg-primary text-primary-foreground"
              onClick={buildDeposit}
              disabled={!amountWei || busy}
            >
              Build Deposit
            </button>
            <button
              className="px-3 py-2 rounded-md bg-muted text-foreground"
              onClick={buildWithdraw}
              disabled={!amountWei || busy}
            >
              Build Withdraw
            </button>
          </div>

          <div>
            <label className="block text-sm mb-1">Result Payload</label>
            <textarea
              className="w-full h-40 border rounded-md px-3 py-2 font-mono text-xs bg-background text-foreground"
              readOnly
              value={result ? JSON.stringify(result, null, 2) : ""}
              placeholder='Click "Build" to see JSON payload (chainId, to, data, value)'
            />
          </div>
        </>
      )}
    </section>
  )
}

export { TxBuilderComponent as TxBuilder }
