"use client"

import useSWR from "swr"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function VaultList() {
  const { data } = useSWR<{ items: Array<{ address: string; chainId: number; name: string }> }>("/api/vaults", fetcher)
  const items = data?.items || []

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Vaults</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Configure NEXT_PUBLIC_DELEGATE_VAULT_ADDRESS.
          </CardContent>
        </Card>
      ) : (
        items.map((v) => (
          <Card key={v.address}>
            <CardHeader>
              <CardTitle className="text-pretty">{v.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs text-muted-foreground break-all">Address: {v.address}</div>
              <div className="text-xs text-muted-foreground">Chain ID: {v.chainId}</div>
              <Link href={`/vaults/${v.address}`}>
                <Button size="sm">Open</Button>
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
