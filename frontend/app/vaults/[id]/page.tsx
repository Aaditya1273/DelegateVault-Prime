'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function VaultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl mb-4">Please connect your wallet</h1>
          <button onClick={() => router.push('/')} className="px-4 py-2 bg-blue-600 rounded">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleDeposit = async () => {
    setLoading(true);
    try {
      // API call here
      alert(`Depositing ${amount} to vault ${params.id}`);
    } catch (err) {
      alert('Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      // API call here
      alert(`Withdrawing ${amount} from vault ${params.id}`);
    } catch (err) {
      alert('Withdraw failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-4 text-blue-400">
          ← Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold mb-8">Vault #{params.id}</h1>

        {/* Vault Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 p-6 rounded">
            <div className="text-gray-400 mb-2">APY</div>
            <div className="text-3xl font-bold text-green-400">18.5%</div>
          </div>
          <div className="bg-gray-900 p-6 rounded">
            <div className="text-gray-400 mb-2">TVL</div>
            <div className="text-3xl font-bold">$45,000</div>
          </div>
          <div className="bg-gray-900 p-6 rounded">
            <div className="text-gray-400 mb-2">Your Balance</div>
            <div className="text-3xl font-bold">$12,500</div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-900 p-8 rounded mb-8">
          <h2 className="text-2xl font-bold mb-4">Manage Position</h2>
          
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full bg-gray-800 p-4 rounded mb-4 text-white"
          />

          <div className="flex gap-4">
            <button
              onClick={handleDeposit}
              disabled={loading || !amount}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 p-4 rounded font-bold"
            >
              {loading ? 'Processing...' : 'Deposit'}
            </button>
            <button
              onClick={handleWithdraw}
              disabled={loading || !amount}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 p-4 rounded font-bold"
            >
              {loading ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-gray-900 p-8 rounded">
          <h2 className="text-2xl font-bold mb-4">Performance</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>24h Change:</span>
              <span className="text-green-400">+5.2%</span>
            </div>
            <div className="flex justify-between">
              <span>7d Change:</span>
              <span className="text-green-400">+12.8%</span>
            </div>
            <div className="flex justify-between">
              <span>30d Change:</span>
              <span className="text-green-400">+45.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
