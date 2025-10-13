import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { shortAddress } from "@/lib/address"

type Vault = {
  address: string
  name?: string
  symbol?: string
  asset?: string
  totalAssets?: string | number
}

export default function VaultCard({ vault }: { vault: Vault }) {
  return (
    <Link href={`/vaults/${vault.address}`} className="block">
      <Card className={cn("hover:bg-accent transition-colors")}>
        <CardHeader>
          <CardTitle className="text-foreground">
            {vault.name || "Vault"}{" "}
            <span className="text-muted-foreground font-normal">{vault.symbol ? `(${vault.symbol})` : ""}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div>{`Address: ${shortAddress(vault.address)}`}</div>
          <div>{`Asset: ${vault.asset || "—"}`}</div>
          <div>{`Total Assets: ${vault.totalAssets ?? "—"}`}</div>
        </CardContent>
      </Card>
    </Link>
  )
}
