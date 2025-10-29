'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Shield, Zap, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface VaultCardProps {
  vault: {
    id: string;
    name: string;
    apy: number;
    tvl: number;
    balance: number;
    change24h: number;
    risk: 'low' | 'medium' | 'high';
    strategy: string;
  };
}

export default function VaultCard({ vault }: VaultCardProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'from-green-500 to-emerald-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'high': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <GlassCard className="p-6 relative overflow-hidden group cursor-pointer">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getRiskColor(vault.risk)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-xl font-bold">{vault.name}</h3>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getRiskBadgeColor(vault.risk)}`}>
                  {vault.risk.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-400 flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>{vault.strategy}</span>
              </p>
            </div>
            
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRiskColor(vault.risk)} flex items-center justify-center`}>
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* APY */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-1">Current APY</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold gradient-text-blue">{vault.apy}%</span>
              <div className={`flex items-center space-x-1 text-sm font-semibold ${vault.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {vault.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{Math.abs(vault.change24h)}%</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">Your Balance</div>
              <div className="text-lg font-bold">${vault.balance.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Total TVL</div>
              <div className="text-lg font-bold">${vault.tvl.toLocaleString()}</div>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-glass flex items-center justify-center space-x-2 group"
          >
            <span>Manage Vault</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
