import { VaultDetail } from "@/components/vault/vault-detail"

export function generateMetadata({ params }: { params: { address: string } }) {
  return {
    title: `Vault ${params.address} | DelegateVault Prime`,
    description: "Interact with the vault and view positions.",
  }
}

export default function VaultDetailPage({ params }: { params: { address: string } }) {
  return (
    <main className="min-h-dvh p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-pretty">Vault Detail</h1>
        <p className="text-muted-foreground">Interact with the vault and view positions.</p>
      </header>
      <VaultDetail address={params.address} />
    </main>
  )
}
