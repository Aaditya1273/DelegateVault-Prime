import { TxBuilder } from "@/components/onchain/tx-builder"
import VaultMetadataPanel from "@/components/onchain/vault-metadata-panel"
import EventsPanel from "@/components/onchain/events-panel"

export default function VaultTxPage({ params }: { params: { address: string } }) {
  const { address } = params
  return (
    <main className="container mx-auto max-w-4xl p-6 space-y-6">
      <VaultMetadataPanel address={address} />
      <EventsPanel address={address} />
      <TxBuilder vaultAddress={address} />
    </main>
  )
}
