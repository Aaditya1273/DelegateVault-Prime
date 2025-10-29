'use client';

import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useState } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [strategy, setStrategy] = useState('balanced');
  const [autoCompound, setAutoCompound] = useState(true);
  const [notifications, setNotifications] = useState(true);

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
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 text-blue-400 hover:text-blue-300">
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-8">⚙️ Vault Settings</h1>

        {/* Strategy Settings */}
        <div className="bg-gray-900 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Investment Strategy</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Select Strategy</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
              >
                <option value="conservative">Conservative (Low Risk)</option>
                <option value="balanced">Balanced (Medium Risk)</option>
                <option value="aggressive">Aggressive (High Risk)</option>
                <option value="ai-optimized">AI-Optimized</option>
              </select>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                <strong>Current Strategy:</strong> {strategy.charAt(0).toUpperCase() + strategy.slice(1)}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Expected APY: {strategy === 'conservative' ? '8-12%' : strategy === 'balanced' ? '14-18%' : strategy === 'aggressive' ? '22-28%' : '16-22%'}
              </p>
            </div>
          </div>
        </div>

        {/* Auto-Compound */}
        <div className="bg-gray-900 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Auto-Compound</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Enable Auto-Compound</p>
              <p className="text-sm text-gray-400">Automatically reinvest rewards to maximize returns</p>
            </div>
            <button
              onClick={() => setAutoCompound(!autoCompound)}
              className={`w-16 h-8 rounded-full transition ${autoCompound ? 'bg-green-600' : 'bg-gray-700'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition transform ${autoCompound ? 'translate-x-9' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-900 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Notifications</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Enable Notifications</p>
              <p className="text-sm text-gray-400">Get alerts for important vault events</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-16 h-8 rounded-full transition ${notifications ? 'bg-green-600' : 'bg-gray-700'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition transform ${notifications ? 'translate-x-9' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Risk Management */}
        <div className="bg-gray-900 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Risk Management</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Stop Loss (%)</label>
              <input
                type="number"
                placeholder="10"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Take Profit (%)</label>
              <input
                type="number"
                placeholder="50"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={() => {
            alert('Settings saved successfully!');
            router.back();
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-4 rounded-lg font-bold text-white transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
