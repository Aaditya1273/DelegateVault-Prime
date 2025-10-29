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
    <GlassCard className="p-6">
      <h3 className="text-xl font-bold mb-6">Quick Stats</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-xl glass-hover">
            <div className="flex items-center space-x-3">
              <div className={`${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-gray-400">{stat.label}</span>
            </div>
            <span className="font-bold">{stat.value}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
