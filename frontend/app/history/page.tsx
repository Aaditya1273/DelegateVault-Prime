'use client';

import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

export default function HistoryPage() {
  const router = useRouter();
  const { isConnected } = useAccount();

  const transactions = [
    { id: 1, type: 'Deposit', amount: 5000, date: '2025-10-28', status: 'Completed', hash: '0x1234...5678' },
    { id: 2, type: 'Withdraw', amount: 1000, date: '2025-10-27', status: 'Completed', hash: '0x2345...6789' },
    { id: 3, type: 'Deposit', amount: 3000, date: '2025-10-26', status: 'Completed', hash: '0x3456...7890' },
    { id: 4, type: 'Reward', amount: 150, date: '2025-10-25', status: 'Completed', hash: '0x4567...8901' },
    { id: 5, type: 'Deposit', amount: 2500, date: '2025-10-24', status: 'Completed', hash: '0x5678...9012' },
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
      <div className="max-w-7xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 text-blue-400 hover:text-blue-300">
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-8">📜 Transaction History</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button className="px-4 py-2 bg-blue-600 rounded">All</button>
          <button className="px-4 py-2 bg-gray-800 rounded">Deposits</button>
          <button className="px-4 py-2 bg-gray-800 rounded">Withdrawals</button>
          <button className="px-4 py-2 bg-gray-800 rounded">Rewards</button>
        </div>

        {/* Transaction List */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Transaction</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded text-sm font-bold ${
                      tx.type === 'Deposit' ? 'bg-green-900 text-green-400' :
                      tx.type === 'Withdraw' ? 'bg-red-900 text-red-400' :
                      'bg-blue-900 text-blue-400'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    <span className={tx.type === 'Withdraw' ? 'text-red-400' : 'text-green-400'}>
                      {tx.type === 'Withdraw' ? '-' : '+'}${tx.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{tx.date}</td>
                  <td className="px-6 py-4">
                    <span className="text-green-400">✓ {tx.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <a href="#" className="text-blue-400 hover:text-blue-300 font-mono text-sm">
                      {tx.hash}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="text-gray-400 mb-2">Total Deposits</div>
            <div className="text-2xl font-bold text-green-400">$10,500</div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="text-gray-400 mb-2">Total Withdrawals</div>
            <div className="text-2xl font-bold text-red-400">$1,000</div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="text-gray-400 mb-2">Total Rewards</div>
            <div className="text-2xl font-bold text-blue-400">$150</div>
          </div>
        </div>
      </div>
    </div>
  );
}
