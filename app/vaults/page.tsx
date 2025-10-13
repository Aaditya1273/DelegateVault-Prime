import { VaultList } from "@/components/vault/vault-list"

export const metadata = {
  title: "Vaults | DelegateVault Prime",
  description: "Browse available DelegateVaults.",
}

export default function VaultsPage() {
  return (
    <main className="min-h-dvh p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-pretty">Vaults</h1>
        <p className="text-muted-foreground">Browse available DelegateVaults.</p>
      </header>
      <VaultList />
    </main>
  )
}
