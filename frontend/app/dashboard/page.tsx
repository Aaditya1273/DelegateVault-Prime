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

  // Use real vaults from API or fallback to mock data
  const displayVaults = vaults.length > 0 ? vaults : [
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

  return (
    <div className="min-h-screen animated-gradient">
      <AnimatedBackground />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer"
                onClick={() => router.push('/')}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold gradient-text-blue">Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome back, {address?.slice(0, 6)}...{address?.slice(-4)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-glass"
                onClick={() => router.push('/vaults')}
              >
                Vaults
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-glass"
                onClick={() => router.push('/circles')}
              >
                Circles
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-glass"
                onClick={() => router.push('/leaderboard')}
              >
                Leaderboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-glass"
                onClick={() => router.push('/profile')}
              >
                <Users className="w-4 h-4 mr-2" />
                My Vaults
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Vault
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
            >
              <GlassCard className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  <div className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </GlassCard>
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
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Portfolio Performance</h2>
                <p className="text-gray-400">Last 30 days</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="btn-glass text-sm px-4 py-2">7D</button>
                <button className="btn-primary text-sm px-4 py-2">30D</button>
                <button className="btn-glass text-sm px-4 py-2">90D</button>
                <button className="btn-glass text-sm px-4 py-2">1Y</button>
              </div>
            </div>
            <PerformanceChart />
          </GlassCard>
        </motion.div>

        {/* Vaults Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Vaults</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
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
    </div>
  );
}
