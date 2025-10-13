import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getConfig() {
  const res = await fetch("/api/config", { cache: "no-store" })
  if (!res.ok) return { vaultAddress: "", chainId: 0 }
  return res.json()
}

async function getHealth() {
  const res = await fetch("/api/health", { cache: "no-store" })
  if (!res.ok) return { status: "down", service: "delegatevault-prime", time: "" }
  return res.json()
}

export default async function Home() {
  const [cfg, health] = await Promise.all([getConfig(), getHealth()])

  return (
    <main className="min-h-dvh p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-pretty">DelegateVault Prime</h1>
        <p className="text-muted-foreground">Social DeFi vaults with AI orchestration.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Status: </span>
              <span>{health?.status || "unknown"}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Timestamp: </span>
              <span>{health?.time || "…"}</span>
            </div>
            <Link href="/api/health">
              <Button size="sm" variant="secondary">
                Ping
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>On-Chain</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Chain ID: </span>
              <span>{cfg?.chainId || 0}</span>
            </div>
            <div className="text-sm break-all">
              <span className="text-muted-foreground">Vault: </span>
              <span>{cfg?.vaultAddress || "Not set"}</span>
            </div>
            <Link href="/api/config">
              <Button size="sm" variant="secondary">
                View Config
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contracts & ABI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The ABI is exported at {"lib/abi/delegate-vault.ts"}. Point your client to the deployed address.
            </p>
            <Link href="https://placeholder.invalid/docs" target="_blank" rel="noopener noreferrer">
              <Button size="sm">Docs (add yours)</Button>
            </Link>
          </CardContent>
        </Card>

        {/* add link to vaults page */}
        <Card>
          <CardHeader>
            <CardTitle>Vaults</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You can navigate to /vaults to see the new list and detail pages.
            </p>
            <Link href="/vaults">
              <Button size="sm">View Vaults</Button>
            </Link>
          </CardContent>
        </Card>
        {/* </CHANGE> */}
      </section>
    </main>
  )
}
