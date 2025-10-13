import { toChecksum, explorerAddressUrl } from "@/lib/viem"
import VaultMetadataPanel from "@/components/onchain/vault-metadata-panel"
import EventsPanel from "@/components/onchain/events-panel"
import TxBuilder from "@/components/onchain/tx-builder"

export default async function OnchainVaultPage({ params }: { params: { address: string } }) {
  const address = toChecksum(params.address)
  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance">On-Chain Vault</h1>
        <a href={explorerAddressUrl(address)} target="_blank" rel="noreferrer" className="text-primary underline">
          View on Explorer
        </a>
      </header>

      <VaultMetadataPanel address={address} />
      <EventsPanel address={address} />
      <TxBuilder address={address} />
    </main>
  )
}
