"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Config = {
  factoryAddress: string
  vaultAddresses: string[]
}
const STORAGE_KEY = "dvp:config"

export default function OnchainIndex() {
  const [config, setConfig] = useState<Config>({ factoryAddress: "", vaultAddresses: [] })
  const [addr, setAddr] = useState("")

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setConfig(JSON.parse(raw))
    } catch {}
  }, [])

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">On-Chain Vaults</h1>
        <Link href="/settings" className="text-primary underline">
          Settings
        </Link>
      </header>

      <section className="border rounded-md p-4 space-y-3">
        <h2 className="text-lg font-medium">Open Vault by Address</h2>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-md px-3 py-2 bg-background text-foreground"
            placeholder="0x… vault address"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
          />
          <Link
            href={addr ? `/onchain/${addr}` : "#"}
            className="px-3 py-2 rounded-md bg-primary text-primary-foreground pointer-events-auto"
            aria-disabled={!addr}
          >
            Open
          </Link>
        </div>
      </section>

      <section className="border rounded-md p-4">
        <h2 className="text-lg font-medium mb-2">Saved Vaults</h2>
        {config.vaultAddresses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No saved vaults. Add them in{" "}
            <Link href="/settings" className="underline">
              Settings
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-2">
            {config.vaultAddresses.map((v) => (
              <li key={v} className="flex items-center justify-between">
                <span className="font-mono text-sm">{v}</span>
                <Link href={`/onchain/${v}`} className="text-primary underline">
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
