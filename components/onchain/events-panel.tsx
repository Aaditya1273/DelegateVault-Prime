"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/swr"

export default function EventsPanel({ address }: { address: string }) {
  const { data, error, isLoading } = useSWR(`/api/onchain/vaults/${address}/events`, fetcher, {
    refreshInterval: 12_000,
  })

  return (
    <section className="border rounded-md p-4">
      <h2 className="text-lg font-medium mb-3">Recent Events</h2>
      {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">Failed to load: {(error as Error).message}</p>}
      {Array.isArray(data) && data.length === 0 && <p className="text-sm text-muted-foreground">No recent events.</p>}
      {Array.isArray(data) && data.length > 0 && (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left">
              <tr>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Caller</th>
                <th className="py-2 pr-4">Owner/Receiver</th>
                <th className="py-2 pr-4">Assets</th>
                <th className="py-2 pr-4">Shares</th>
                <th className="py-2 pr-4">Block</th>
                <th className="py-2 pr-4">Tx</th>
              </tr>
            </thead>
            <tbody>
              {data.map((e: any) => (
                <tr key={`${e.txHash}-${e.logIndex}`} className="border-t">
                  <td className="py-2 pr-4">{e.event}</td>
                  <td className="py-2 pr-4 font-mono">{e.caller}</td>
                  <td className="py-2 pr-4 font-mono">{e.party}</td>
                  <td className="py-2 pr-4">{e.assets}</td>
                  <td className="py-2 pr-4">{e.shares}</td>
                  <td className="py-2 pr-4">{e.blockNumber}</td>
                  <td className="py-2 pr-4 font-mono">{e.txHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
