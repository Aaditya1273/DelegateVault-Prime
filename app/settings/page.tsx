"use client"

import { useEffect, useState } from "react"

type Config = {
  factoryAddress: string
  vaultAddresses: string[]
}

const STORAGE_KEY = "dvp:config"

export default function SettingsPage() {
  const [config, setConfig] = useState<Config>({ factoryAddress: "", vaultAddresses: [] })
  const [newVault, setNewVault] = useState("")

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setConfig(JSON.parse(raw))
  }, [])

  function persist(next: Config) {
    setConfig(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-balance">On-chain Settings</h1>

      <label className="block text-sm mb-1">Factory Address</label>
      <input
        className="w-full border rounded-md px-3 py-2 mb-4 bg-background text-foreground"
        value={config.factoryAddress}
        onChange={(e) => persist({ ...config, factoryAddress: e.target.value })}
        placeholder="0x..."
        aria-label="Factory Address"
      />

      <div className="mb-4">
        <label className="block text-sm mb-1">Vault Addresses</label>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-md px-3 py-2 bg-background text-foreground"
            value={newVault}
            onChange={(e) => setNewVault(e.target.value)}
            placeholder="0x..."
            aria-label="Vault Address"
          />
          <button
            className="px-3 py-2 rounded-md bg-primary text-primary-foreground"
            onClick={() => {
              if (!newVault) return
              const next = { ...config, vaultAddresses: Array.from(new Set([...config.vaultAddresses, newVault])) }
              persist(next)
              setNewVault("")
            }}
          >
            Add
          </button>
        </div>
        <ul className="mt-2 space-y-1">
          {config.vaultAddresses.map((addr) => (
            <li key={addr} className="flex items-center justify-between text-sm">
              <span className="font-mono">{addr}</span>
              <button
                className="text-destructive"
                onClick={() => persist({ ...config, vaultAddresses: config.vaultAddresses.filter((a) => a !== addr) })}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-muted-foreground">
        Settings are stored locally in your browser (no env vars required).
      </p>
    </main>
  )
}
