"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DepositForm() {
  const [amount, setAmount] = useState("")
  const [assetMode, setAssetMode] = useState<"ETH" | "ERC20">("ETH")
  const [result, setResult] = useState<any>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/actions/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, assetMode }),
    })
    const json = await res.json()
    setResult(json)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label>Amount</Label>
        <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1000000000000000000" />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={assetMode === "ETH" ? "default" : "secondary"}
          onClick={() => setAssetMode("ETH")}
        >
          ETH
        </Button>
        <Button
          type="button"
          variant={assetMode === "ERC20" ? "default" : "secondary"}
          onClick={() => setAssetMode("ERC20")}
        >
          ERC20
        </Button>
      </div>
      <Button type="submit">Build Deposit</Button>
      {result && <pre className="text-xs bg-muted p-2 rounded overflow-auto">{JSON.stringify(result, null, 2)}</pre>}
    </form>
  )
}
