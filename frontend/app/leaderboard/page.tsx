'use client';

import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export default function LeaderboardPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const users = [
    { rank: 1, address: '0x1234...5678', balance: 125430, apy: 18.5, vaults: 8 },
    { rank: 2, address: '0x2345...6789', balance: 98750, apy: 16.2, vaults: 6 },
    { rank: 3, address: '0x3456...7890', balance: 87320, apy: 15.8, vaults: 5 },
    { rank: 4, address: '0x4567...8901', balance: 76540, apy: 14.3, vaults: 7 },
    { rank: 5, address: '0x5678...9012', balance: 65890, apy: 13.9, vaults: 4 },
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

        <h1 className="text-4xl font-bold mb-8">Leaderboard 🏆</h1>

        {/* Your Rank */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded mb-8">
          <h2 className="text-xl font-bold mb-4">Your Rank</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-5xl font-bold text-yellow-400">#12</div>
              <div className="text-gray-300 mt-2">{address?.slice(0, 10)}...</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">$125,430</div>
              <div className="text-gray-300">Total Balance</div>
            </div>
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-gray-900 p-6 rounded">
          <h2 className="text-2xl font-bold mb-6">Top Performers</h2>
          
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.rank}
                className={`p-4 rounded flex items-center justify-between ${
                  user.rank <= 3 ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30' : 'bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-6">
                  <div className={`text-4xl font-bold ${
                    user.rank === 1 ? 'text-yellow-400' :
                    user.rank === 2 ? 'text-gray-300' :
                    user.rank === 3 ? 'text-orange-400' :
                    'text-gray-500'
                  }`}>
                    #{user.rank}
                  </div>
                  
                  <div>
                    <div className="font-mono font-bold">{user.address}</div>
                    <div className="text-sm text-gray-400">{user.vaults} active vaults</div>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <div className="text-2xl font-bold">${user.balance.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Total Balance</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{user.apy}%</div>
                    <div className="text-sm text-gray-400">Avg APY</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-900 p-6 rounded text-center">
            <div className="text-3xl font-bold mb-2">1,247</div>
            <div className="text-gray-400">Total Users</div>
          </div>
          <div className="bg-gray-900 p-6 rounded text-center">
            <div className="text-3xl font-bold mb-2">$12.5M</div>
            <div className="text-gray-400">Total TVL</div>
          </div>
          <div className="bg-gray-900 p-6 rounded text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">15.8%</div>
            <div className="text-gray-400">Avg APY</div>
          </div>
        </div>
      </div>
    </div>
  );
}
