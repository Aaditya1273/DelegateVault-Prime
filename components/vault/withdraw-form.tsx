"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function WithdrawForm() {
  const [shares, setShares] = useState("")
  const [result, setResult] = useState<any>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/actions/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shares }),
    })
    const json = await res.json()
    setResult(json)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label>Shares</Label>
        <Input value={shares} onChange={(e) => setShares(e.target.value)} placeholder="1000000000000000000" />
      </div>
      <Button type="submit">Build Withdraw</Button>
      {result && <pre className="text-xs bg-muted p-2 rounded overflow-auto">{JSON.stringify(result, null, 2)}</pre>}
    </form>
  )
}
