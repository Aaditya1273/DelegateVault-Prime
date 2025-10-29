'use client';

import { TrendingUp, Users, Zap, Award } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function QuickStats() {
  const stats = [
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Weekly Gain', value: '+$2,450', color: 'text-green-400' },
    { icon: <Users className="w-5 h-5" />, label: 'Circle Members', value: '24', color: 'text-blue-400' },
    { icon: <Zap className="w-5 h-5" />, label: 'Active Strategies', value: '12', color: 'text-yellow-400' },
    { icon: <Award className="w-5 h-5" />, label: 'Achievements', value: '8/20', color: 'text-purple-400' },
  ];

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-gray-800/30 via-gray-900/50 to-black/70 border-2 border-amber-800/40 rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Quick Stats</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-amber-900/20 hover:border-amber-700/40 transition-all">
            <div className="flex items-center space-x-3">
              <div className={`${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-gray-400">{stat.label}</span>
            </div>
            <span className="font-bold text-white">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
