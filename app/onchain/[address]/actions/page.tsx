import VaultMetadataPanel from "../../../../components/onchain/vault-metadata-panel"
import EventsPanel from "../../../../components/onchain/events-panel"
import ConnectWallet from "../../../../components/onchain/connect-wallet"
import TxSender from "../../../../components/onchain/tx-sender"
import type { Address } from "viem"

export default function OnchainActionsPage({ params }: { params: { address: string } }) {
  const vaultAddress = params.address as Address

  return (
    <main className="container mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">Vault Actions</h1>
      <p className="text-sm text-muted-foreground">Network: Monad Testnet (Chain ID 10143)</p>

      <div className="mt-6 grid grid-cols-1 gap-6">
        {/* Metadata */}
        <section>
          <VaultMetadataPanel address={vaultAddress} />
        </section>

        {/* Wallet */}
        <section>
          <ConnectWallet />
        </section>

        {/* Sender */}
        <section>
          <TxSender vaultAddress={vaultAddress} />
        </section>

        {/* Events */}
        <section>
          <EventsPanel address={vaultAddress} />
        </section>
      </div>
    </main>
  )
}
