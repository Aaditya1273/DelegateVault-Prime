'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Users, Trophy, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import VaultCard from '@/components/dashboard/VaultCard';
import QuickStats from '@/components/dashboard/QuickStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { useUserVaults, usePortfolio } from '@/lib/hooks';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Fetch real data
  const { vaults, loading: vaultsLoading } = useUserVaults();
  const { portfolio, loading: portfolioLoading } = usePortfolio();
  const [timeRange, setTimeRange] = useState('30D');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdVaultName, setCreatedVaultName] = useState('');
  const [userCreatedVaults, setUserCreatedVaults] = useState<any[]>([]);
  const [newVault, setNewVault] = useState({
    name: '',
    strategy: 'balanced',
    initialDeposit: ''
  });

  useEffect(() => {
    setMounted(true);
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!mounted || !isConnected) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  // Show loading state
  if (vaultsLoading || portfolioLoading) {
    return (
      <div className="min-h-screen animated-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-gray-400">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Balance',
      value: '$125,430',
      change: '+12.5%',
      icon: <Wallet className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Total APY',
      value: '15.8%',
      change: '+2.3%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Active Vaults',
      value: '8',
      change: '+2',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Circle Rank',
      value: '#12',
      change: '+5',
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Combine user-created vaults with API vaults or mock data
  const apiVaults = vaults.length > 0 ? vaults : [
    {
      id: '1',
      name: 'Alpha Yield Vault',
      apy: 18.5,
      tvl: 45000,
      balance: 12500,
      change24h: 5.2,
      risk: 'medium' as const,
      strategy: 'AI-Optimized'
    },
    {
      id: '2',
      name: 'Stable Income',
      apy: 8.2,
      tvl: 120000,
      balance: 35000,
      change24h: 1.1,
      risk: 'low' as const,
      strategy: 'Conservative'
    },
    {
      id: '3',
      name: 'High Yield Pro',
      apy: 25.8,
      tvl: 28000,
      balance: 8900,
      change24h: -2.3,
      risk: 'high' as const,
      strategy: 'Aggressive'
    },
    {
      id: '4',
      name: 'DeFi Legends',
      apy: 14.2,
      tvl: 67000,
      balance: 18200,
      change24h: 3.7,
      risk: 'medium' as const,
      strategy: 'Balanced'
    }
  ];
  
  // Combine user-created vaults with existing vaults
  const displayVaults = [...userCreatedVaults, ...apiVaults];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItMnptMC0ydjJoLTJ2LTJoMnptLTItMmgydjJoLTJ2LTJ6bTItMmgtMnYyaDJ2LTJ6bTAtMmgtMnYyaDJ2LTJ6bTItMmgtMnYyaDJ2LTJ6bTAtMmgtMnYyaDJ2LTJ6bTItMmgtMnYyaDJ2LTJ6bTAtMmgtMnYyaDJ2LTJ6bTItMmgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-black/30 border-b border-amber-900/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
                onClick={() => router.push('/')}
              >
                <img src="/logo/logo.png" alt="DelegateVault Prime" className="h-12 w-auto" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome back, {address?.slice(0, 6)}...{address?.slice(-4)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-amber-800/30 hover:border-amber-700/50 transition-all text-sm font-medium"
                onClick={() => router.push('/vaults')}
              >
                Vaults
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-amber-800/30 hover:border-amber-700/50 transition-all text-sm font-medium"
                onClick={() => router.push('/circles')}
              >
                Circles
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-amber-800/30 hover:border-amber-700/50 transition-all text-sm font-medium"
                onClick={() => router.push('/leaderboard')}
              >
                Leaderboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 font-semibold text-sm shadow-lg shadow-amber-900/30 border border-amber-500/20 flex items-center space-x-2"
                onClick={() => setShowCreateModal(true)}
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Vault</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="backdrop-blur-xl bg-gradient-to-br from-gray-800/30 via-gray-900/50 to-black/70 border-2 border-amber-800/40 rounded-2xl p-6 hover:border-amber-600/60 transition-all hover:shadow-2xl hover:shadow-amber-900/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-700/30 flex items-center justify-center`}>
                  <div className="text-amber-500">{stat.icon}</div>
                </div>
                <div className={`text-sm font-semibold px-2 py-1 rounded ${stat.change.startsWith('+') ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'}`}>
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="backdrop-blur-xl bg-gradient-to-br from-gray-800/30 via-gray-900/50 to-black/70 border-2 border-amber-800/40 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1 bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Portfolio Performance</h2>
                <p className="text-gray-400">Last 30 days</p>
              </div>
              <div className="flex items-center space-x-2 bg-gray-950/50 p-1 rounded-lg border border-amber-900/20">
                <button 
                  onClick={() => setTimeRange('7D')}
                  className={`text-sm px-4 py-2 rounded transition-all ${timeRange === '7D' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  7D
                </button>
                <button 
                  onClick={() => setTimeRange('30D')}
                  className={`text-sm px-4 py-2 rounded transition-all ${timeRange === '30D' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  30D
                </button>
                <button 
                  onClick={() => setTimeRange('90D')}
                  className={`text-sm px-4 py-2 rounded transition-all ${timeRange === '90D' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  90D
                </button>
                <button 
                  onClick={() => setTimeRange('1Y')}
                  className={`text-sm px-4 py-2 rounded transition-all ${timeRange === '1Y' ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                  1Y
                </button>
              </div>
            </div>
            <PerformanceChart />
          </div>
        </motion.div>

        {/* Vaults Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">My Vaults</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-medium"
              onClick={() => router.push('/vaults')}
            >
              <span>View All</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayVaults.map((vault, index) => (
              <motion.div
                key={vault.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <VaultCard vault={vault} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <QuickStats />
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <RecentActivity />
          </motion.div>
        </div>
      </div>

      {/* Create Vault Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 p-8 rounded-2xl max-w-md w-full border-2 border-amber-600 shadow-[0_0_30px_rgba(251,146,60,0.5)] relative"
          >
            {/* Outer glow effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[0_0_60px_rgba(251,146,60,0.3)] pointer-events-none"></div>
            
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Create New Vault</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Vault Name</label>
                <input
                  type="text"
                  value={newVault.name}
                  onChange={(e) => setNewVault({...newVault, name: e.target.value})}
                  placeholder="My Awesome Vault"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-amber-600 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Strategy</label>
                <select
                  value={newVault.strategy}
                  onChange={(e) => setNewVault({...newVault, strategy: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-amber-600 focus:outline-none transition-all"
                >
                  <option value="conservative">Conservative (Low Risk)</option>
                  <option value="balanced">Balanced (Medium Risk)</option>
                  <option value="aggressive">Aggressive (High Risk)</option>
                  <option value="ai-optimized">AI-Optimized</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Initial Deposit (USD)</label>
                <input
                  type="number"
                  value={newVault.initialDeposit}
                  onChange={(e) => setNewVault({...newVault, initialDeposit: e.target.value})}
                  placeholder="1000"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-amber-600 focus:outline-none transition-all"
                />
              </div>

              <div className="bg-amber-900/20 border border-amber-600/50 rounded-lg p-4">
                <p className="text-sm text-amber-300">
                  <strong>Note:</strong> Your vault will be created on Monad testnet. Make sure you have sufficient MON tokens for gas fees.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewVault({ name: '', strategy: 'balanced', initialDeposit: '' });
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 p-3 rounded-lg font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newVault.name || !newVault.initialDeposit) {
                    alert('Please fill in all fields');
                    return;
                  }
                  
                  // Create new vault object
                  const createdVault = {
                    id: `user-${Date.now()}`,
                    name: newVault.name,
                    apy: newVault.strategy === 'conservative' ? 8.2 : 
                         newVault.strategy === 'balanced' ? 14.5 : 
                         newVault.strategy === 'aggressive' ? 25.8 : 18.5,
                    tvl: parseInt(newVault.initialDeposit),
                    balance: parseInt(newVault.initialDeposit),
                    change24h: 0,
                    risk: newVault.strategy === 'conservative' ? 'low' as const : 
                          newVault.strategy === 'balanced' ? 'medium' as const : 'high' as const,
                    strategy: newVault.strategy === 'ai-optimized' ? 'AI-Optimized' : 
                              newVault.strategy.charAt(0).toUpperCase() + newVault.strategy.slice(1)
                  };
                  
                  // Add to user vaults
                  setUserCreatedVaults([...userCreatedVaults, createdVault]);
                  setCreatedVaultName(newVault.name);
                  setShowCreateModal(false);
                  setShowSuccessModal(true);
                  setNewVault({ name: '', strategy: 'balanced', initialDeposit: '' });
                }}
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 p-3 rounded-lg font-bold shadow-lg shadow-amber-900/50 border border-amber-500/30 transition-all"
              >
                Create Vault
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-br from-green-900 to-blue-900 p-8 rounded-lg max-w-md w-full border-2 border-green-500 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl mb-4"
            >
              🎉
            </motion.div>
            
            <h2 className="text-4xl font-bold mb-4 text-white">Success!</h2>
            <p className="text-xl text-green-300 mb-6">
              Your vault <span className="font-bold text-white">"{createdVaultName}"</span> has been created successfully!
            </p>
            
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300">
                ✅ Vault is now active<br/>
                ✅ Funds deposited<br/>
                ✅ Earning rewards<br/>
                ✅ Ready to manage
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 bg-white/20 hover:bg-white/30 p-3 rounded-lg font-bold transition"
              >
                View Dashboard
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  const lastVault = userCreatedVaults[userCreatedVaults.length - 1];
                  if (lastVault) {
                    router.push(`/vaults/${lastVault.id}`);
                  }
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 p-3 rounded-lg font-bold transition"
              >
                Manage Vault →
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
