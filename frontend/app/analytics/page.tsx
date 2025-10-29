'use client';

import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export default function AnalyticsPage() {
  const router = useRouter();
  const { isConnected } = useAccount();

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
      <div className="max-w-7xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 text-blue-400 hover:text-blue-300">
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-8">📈 Vault Analytics</h1>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="text-gray-400 mb-2">Total Return</div>
            <div className="text-3xl font-bold text-green-400">+45.3%</div>
            <div className="text-sm text-gray-500">Last 30 days</div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="text-gray-400 mb-2">Average APY</div>
            <div className="text-3xl font-bold text-blue-400">18.5%</div>
            <div className="text-sm text-gray-500">Current rate</div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="text-gray-400 mb-2">Risk Score</div>
            <div className="text-3xl font-bold text-yellow-400">Medium</div>
            <div className="text-sm text-gray-500">Balanced strategy</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Performance Chart</h2>
            <div className="h-64 flex items-center justify-center bg-gray-800 rounded">
              <p className="text-gray-400">Chart visualization here</p>
            </div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Asset Allocation</h2>
            <div className="h-64 flex items-center justify-center bg-gray-800 rounded">
              <p className="text-gray-400">Pie chart here</p>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Detailed Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-800">
              <span className="text-gray-400">Total Deposits</span>
              <span className="font-bold">$12,500</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-800">
              <span className="text-gray-400">Total Earnings</span>
              <span className="font-bold text-green-400">+$2,315</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-800">
              <span className="text-gray-400">Best Day</span>
              <span className="font-bold text-green-400">+$450</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-800">
              <span className="text-gray-400">Worst Day</span>
              <span className="font-bold text-red-400">-$120</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-400">Win Rate</span>
              <span className="font-bold">78%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
