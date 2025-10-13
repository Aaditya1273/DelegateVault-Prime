"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/swr"

export default function VaultMetadataPanel({ address }: { address: string }) {
  const { data, error, isLoading } = useSWR(`/api/onchain/vaults/${address}/metadata`, fetcher, {
    refreshInterval: 12_000,
  })

  return (
    <section className="border rounded-md p-4">
      <h2 className="text-lg font-medium mb-3">Vault Metadata</h2>
      {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">Failed to load: {(error as Error).message}</p>}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Vault:</span> <span className="font-mono">{data.vault}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Asset:</span> <span className="font-mono">{data.asset}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Asset Symbol:</span> {data.assetSymbol}
          </div>
          <div>
            <span className="text-muted-foreground">Asset Decimals:</span> {data.assetDecimals}
          </div>
          <div>
            <span className="text-muted-foreground">Total Assets:</span> {data.totalAssets}
          </div>
          <div>
            <span className="text-muted-foreground">Total Supply (shares):</span> {data.totalSupply}
          </div>
        </div>
      )}
    </section>
  )
}
