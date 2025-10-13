"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/swr"
import VaultCard from "./vault-card"

type Vault = {
  address: string
  name?: string
  symbol?: string
  asset?: string
  totalAssets?: string | number
}

export default function VaultsList({ initialVaults }: { initialVaults: Vault[] }) {
  const { data, error, isValidating } = useSWR<Vault[]>("/api/vaults", fetcher, {
    fallbackData: initialVaults,
    revalidateOnFocus: true,
  })

  if (error) {
    return <div className="text-destructive">{"Failed to load vaults."}</div>
  }

  const vaults = data || []

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {vaults.length === 0 && !isValidating ? <div className="text-muted-foreground">{"No vaults found."}</div> : null}
      {vaults.map((v) => (
        <VaultCard key={v.address} vault={v} />
      ))}
    </section>
  )
}
