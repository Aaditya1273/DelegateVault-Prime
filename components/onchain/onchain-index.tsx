"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

type VaultEntry = { address: string; label?: string }
const LS_KEY = "dv.vaults"

export default function OnchainIndex() {
  const [list, setList] = useState<VaultEntry[]>([])
  const [addr, setAddr] = useState("")
  const [label, setLabel] = useState("")

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setList(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(list))
    } catch {}
  }, [list])

  const add = () => {
    const a = addr.trim()
    if (!/^0x[a-fA-F0-9]{40}$/.test(a)) return
    setList((prev) => [...prev, { address: a, label: label.trim() || undefined }])
    setAddr("")
    setLabel("")
  }

  const remove = (a: string) => {
    setList((prev) => prev.filter((v) => v.address !== a))
  }

  return (
    <Card className="bg-background text-foreground">
      <CardHeader>
        <CardTitle className="text-balance">On-Chain Vaults (Local)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="address">Vault Address</Label>
            <Input id="address" placeholder="0x..." value={addr} onChange={(e) => setAddr(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="label">Label (optional)</Label>
            <Input id="label" placeholder="My Vault" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button onClick={add}>Add</Button>
          </div>
        </div>

        <div className="grid gap-3">
          {list.length === 0 ? (
            <p className="text-sm opacity-70">No vaults saved yet.</p>
          ) : (
            list.map((v) => (
              <div key={v.address} className="flex items-center justify-between border rounded-md p-3">
                <div className="text-sm">
                  <div className="font-medium">{v.label || "Vault"}</div>
                  <div className="opacity-70">{v.address}</div>
                </div>
                <div className="flex gap-2">
                  <Link className="underline text-sm" href={`/onchain/${v.address}`}>
                    View
                  </Link>
                  <Link className="underline text-sm" href={`/onchain/${v.address}/tx`}>
                    Build Tx
                  </Link>
                  <Button variant="outline" onClick={() => remove(v.address)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
