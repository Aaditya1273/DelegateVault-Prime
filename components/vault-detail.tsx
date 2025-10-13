"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DepositWithdrawForm from "./deposit-withdraw-form"
import { shortAddress } from "@/lib/address"

type Vault = {
  address: string
  name?: string
  symbol?: string
  asset?: string
  totalAssets?: string | number
  managementFeeBps?: number
  performanceFeeBps?: number
}

type Position = {
  account: string
  shares?: string | number
  assets?: string | number
  updatedAt?: string
}

export default function VaultDetail({
  address,
  initialVault,
  initialPositions,
}: {
  address: string
  initialVault: Vault | null
  initialPositions: Position[]
}) {
  const { data: vault } = useSWR<Vault>(`/api/vaults/${address}`, fetcher, {
    fallbackData: initialVault ?? undefined,
    revalidateOnFocus: true,
  })
  const { data: positions } = useSWR<Position[]>(`/api/vaults/${address}/positions`, fetcher, {
    fallbackData: initialPositions ?? [],
    revalidateOnFocus: true,
  })

  return (
    <section className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            {vault?.name || "Vault"}{" "}
            <span className="text-muted-foreground font-normal">
              {vault?.symbol ? `(${vault.symbol})` : ""} — {shortAddress(address)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="text-foreground">Asset</div>
              <div>{vault?.asset || "—"}</div>
            </div>
            <div>
              <div className="text-foreground">Total Assets</div>
              <div>{vault?.totalAssets ?? "—"}</div>
            </div>
            <div>
              <div className="text-foreground">Mgmt Fee (bps)</div>
              <div>{vault?.managementFeeBps ?? "—"}</div>
            </div>
            <div>
              <div className="text-foreground">Perf Fee (bps)</div>
              <div>{vault?.performanceFeeBps ?? "—"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="interact" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interact">Interact</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
        </TabsList>
        <TabsContent value="interact" className="mt-4">
          <DepositWithdrawForm address={address} />
        </TabsContent>
        <TabsContent value="positions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {positions && positions.length > 0 ? (
                  <div className="divide-y">
                    {positions.map((p) => (
                      <div key={p.account} className="flex items-center justify-between py-2">
                        <div className="text-foreground">{shortAddress(p.account)}</div>
                        <div className="flex gap-6">
                          <div>{`Assets: ${p.assets ?? "—"}`}</div>
                          <div>{`Shares: ${p.shares ?? "—"}`}</div>
                          <div>{p.updatedAt ? new Date(p.updatedAt).toLocaleString() : ""}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>{"No positions found."}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
