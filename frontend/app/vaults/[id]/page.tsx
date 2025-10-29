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
  const [balance, setBalance] = useState(12500);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showCloseModal, setShowCloseModal] = useState(false);
  const vaultName = 'Alpha Yield Vault';

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

  const showToastNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToastNotification('Please enter a valid amount', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const depositAmount = parseFloat(amount);
      setBalance(balance + depositAmount);
      showToastNotification(`✅ Successfully deposited $${depositAmount.toLocaleString()}!`, 'success');
      setAmount('');
    } catch (err) {
      showToastNotification('❌ Deposit failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToastNotification('Please enter a valid amount', 'error');
      return;
    }
    
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > balance) {
      showToastNotification('❌ Insufficient balance!', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setBalance(balance - withdrawAmount);
      showToastNotification(`✅ Successfully withdrew $${withdrawAmount.toLocaleString()}!`, 'success');
      setAmount('');
    } catch (err) {
      showToastNotification('❌ Withdrawal failed. Please try again.', 'error');
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
            <div className="text-3xl font-bold">${balance.toLocaleString()}</div>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => showToastNotification('🤖 AI Analysis: Your vault is performing well! Predicted APY: 19.2% for next 30 days.', 'success')}
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded font-bold flex items-center justify-center gap-2"
          >
            📊 AI Analysis
          </button>
          <button
            onClick={async () => {
              if (balance === 0) {
                showToastNotification('❌ No balance to withdraw!', 'error');
                return;
              }
              setLoading(true);
              await new Promise(resolve => setTimeout(resolve, 500));
              const withdrawnAmount = balance;
              setBalance(0);
              showToastNotification(`✅ Successfully withdrew all funds: $${withdrawnAmount.toLocaleString()}!`, 'success');
              setLoading(false);
            }}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 p-4 rounded font-bold flex items-center justify-center gap-2"
          >
            💰 Withdraw All
          </button>
        </div>

        {/* Performance */}
        <div className="bg-gray-900 p-8 rounded mb-8">
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

        {/* Additional Actions */}
        <div className="bg-gray-900 p-8 rounded">
          <h2 className="text-2xl font-bold mb-4">Vault Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/analytics')}
              className="bg-purple-600 hover:bg-purple-700 p-3 rounded font-bold"
            >
              📈 View Analytics
            </button>
            <button
              onClick={() => router.push('/history')}
              className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded font-bold"
            >
              📜 History
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="bg-teal-600 hover:bg-teal-700 p-3 rounded font-bold"
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => setShowCloseModal(true)}
              className="bg-red-600 hover:bg-red-700 p-3 rounded font-bold"
            >
              🗑️ Close Vault
            </button>
          </div>
        </div>

        {/* Close Vault Confirmation Modal */}
        {showCloseModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-xl bg-white/10 border border-red-400/30 rounded-lg shadow-2xl max-w-md w-full relative overflow-hidden">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20" />
              
              {/* Content */}
              <div className="relative z-10 p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-lg bg-red-500/20 border border-red-400/30 flex items-center justify-center">
                    <span className="text-5xl">🗑️</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Close Vault?</h2>
                  <p className="text-gray-300">
                    Are you sure you want to close <span className="font-bold text-white">"{vaultName}"</span>?
                  </p>
                </div>

                <div className="bg-red-900/20 border border-red-400/20 rounded-lg p-4 mb-6">
                  <p className="text-red-300 text-sm mb-2">⚠️ This action will:</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Withdraw all funds (${balance.toLocaleString()})</li>
                    <li>• Close the vault permanently</li>
                    <li>• Return funds to your wallet</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCloseModal(false)}
                    className="flex-1 backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 p-3 rounded-lg font-bold text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      setShowCloseModal(false);
                      setLoading(true);
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      const withdrawnAmount = balance;
                      setBalance(0);
                      showToastNotification(`✅ Vault "${vaultName}" closed! $${withdrawnAmount.toLocaleString()} withdrawn to your wallet.`, 'success');
                      setLoading(false);
                      setTimeout(() => router.push('/dashboard'), 2500);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 p-3 rounded-lg font-bold text-white transition"
                  >
                    Close Vault
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification - Glassmorphism */}
        {showToast && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <div className={`
              backdrop-blur-xl bg-white/10 
              border ${toastType === 'success' ? 'border-green-400/30' : 'border-red-400/30'}
              rounded-lg shadow-2xl
              transform transition-all duration-300 ease-out
              ${showToast ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
              pointer-events-auto
              max-w-2xl w-full
              relative overflow-hidden
            `}>
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 ${toastType === 'success' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-r from-red-500/20 to-pink-500/20'}`} />
              
              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="flex items-center space-x-4">
                  {/* Icon */}
                  <div className={`
                    w-16 h-16 rounded-lg flex items-center justify-center
                    ${toastType === 'success' ? 'bg-green-500/20 border border-green-400/30' : 'bg-red-500/20 border border-red-400/30'}
                  `}>
                    <span className="text-4xl">
                      {toastType === 'success' ? '✅' : '❌'}
                    </span>
                  </div>
                  
                  {/* Text */}
                  <div className="flex-1">
                    <p className="text-xl font-bold text-white mb-1">{toastMessage}</p>
                    <p className={`text-sm ${toastType === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                      {toastType === 'success' ? 'Transaction completed successfully' : 'Please try again'}
                    </p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div 
                      className={`h-full ${toastType === 'success' ? 'bg-green-400' : 'bg-red-400'}`}
                      style={{
                        animation: 'progress 2s linear forwards'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <style jsx>{`
          @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
}
