'use client';

import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export default function VaultsPage() {
  const router = useRouter();
  const { isConnected } = useAccount();

  const vaults = [
    { id: 1, name: 'Alpha Yield Vault', apy: 18.5, tvl: 45000, risk: 'Medium' },
    { id: 2, name: 'Stable Income', apy: 8.2, tvl: 120000, risk: 'Low' },
    { id: 3, name: 'High Yield Pro', apy: 25.8, tvl: 28000, risk: 'High' },
    { id: 4, name: 'DeFi Legends', apy: 14.2, tvl: 67000, risk: 'Medium' },
    { id: 5, name: 'Conservative Plus', apy: 6.5, tvl: 95000, risk: 'Low' },
    { id: 6, name: 'Aggressive Growth', apy: 32.1, tvl: 18000, risk: 'High' },
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl">Please connect wallet</h1>
        <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-blue-600 rounded">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-4 text-blue-400">
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-8">All Vaults</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <button className="px-4 py-2 bg-blue-600 rounded">All</button>
          <button className="px-4 py-2 bg-gray-800 rounded">Low Risk</button>
          <button className="px-4 py-2 bg-gray-800 rounded">Medium Risk</button>
          <button className="px-4 py-2 bg-gray-800 rounded">High Risk</button>
        </div>

        {/* Vaults Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaults.map((vault) => (
            <div
              key={vault.id}
              onClick={() => router.push(`/vaults/${vault.id}`)}
              className="bg-gray-900 p-6 rounded cursor-pointer hover:bg-gray-800 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{vault.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  vault.risk === 'Low' ? 'bg-green-900 text-green-400' :
                  vault.risk === 'Medium' ? 'bg-yellow-900 text-yellow-400' :
                  'bg-red-900 text-red-400'
                }`}>
                  {vault.risk}
                </span>
              </div>

              <div className="mb-4">
                <div className="text-gray-400 text-sm mb-1">APY</div>
                <div className="text-3xl font-bold text-green-400">{vault.apy}%</div>
              </div>

              <div className="flex justify-between text-sm">
                <div>
                  <div className="text-gray-400">TVL</div>
                  <div className="font-bold">${vault.tvl.toLocaleString()}</div>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
                  View →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
