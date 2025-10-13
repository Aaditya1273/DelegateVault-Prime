"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DepositForm } from "./deposit-form"
import { WithdrawForm } from "./withdraw-form"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function VaultDetail({ address }: { address: string }) {
  const { data: meta } = useSWR(`/api/vaults/${address}`, fetcher)
  const { data: pos } = useSWR(`/api/vaults/${address}/positions`, fetcher)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-pretty break-all">Vault {address}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Chain ID: {meta?.chainId ?? "…"} | Fee: {meta?.feeBps ?? "…"} bps
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Deposit</h3>
              <DepositForm />
            </div>
            <div>
              <h3 className="font-medium mb-2">Withdraw</h3>
              <WithdrawForm />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {!pos?.positions?.length ? (
            <div className="text-sm text-muted-foreground">No positions yet.</div>
          ) : (
            <pre className="text-xs bg-muted p-2 rounded overflow-auto">{JSON.stringify(pos.positions, null, 2)}</pre>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
