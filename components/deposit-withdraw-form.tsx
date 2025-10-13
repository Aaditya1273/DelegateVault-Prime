"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DepositWithdrawForm({ address }: { address: string }) {
  const [amount, setAmount] = useState<string>("")
  const [loading, setLoading] = useState<"deposit" | "withdraw" | null>(null)
  const { toast } = useToast()

  async function submit(kind: "deposit" | "withdraw") {
    if (!amount) {
      toast({ title: "Amount required", description: "Enter an amount first." })
      return
    }
    setLoading(kind)
    try {
      const res = await fetch(`/api/actions/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, amount }),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Request failed")
      }
      const data = await res.json()
      // Example response expectation: { to, data, value } for wallet call
      toast({
        title: "Payload ready",
        description: `to: ${data?.to || "—"}`,
      })
      // In a future phase, connect wallet and submit this call payload.
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Unknown error" })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid gap-4 max-w-md">
      <div className="grid gap-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="text"
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={() => submit("deposit")} disabled={loading !== null}>
          {loading === "deposit" ? "Building…" : "Build Deposit"}
        </Button>
        <Button variant="secondary" onClick={() => submit("withdraw")} disabled={loading !== null}>
          {loading === "withdraw" ? "Building…" : "Build Withdraw"}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        {
          "This does not submit any transaction. It builds a call payload from your server that you can sign and send with a wallet in a later phase."
        }
      </p>
    </div>
  )
}
