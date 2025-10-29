'use client';

import { ArrowUpRight, ArrowDownRight, Repeat, Award } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function RecentActivity() {
  const activities = [
    {
      type: 'deposit',
      icon: <ArrowDownRight className="w-5 h-5 text-green-400" />,
      title: 'Deposited to Alpha Vault',
      amount: '+$5,000',
      time: '2 hours ago',
      color: 'text-green-400'
    },
    {
      type: 'withdraw',
      icon: <ArrowUpRight className="w-5 h-5 text-blue-400" />,
      title: 'Withdrew from Stable Income',
      amount: '-$2,500',
      time: '5 hours ago',
      color: 'text-blue-400'
    },
    {
      type: 'rebalance',
      icon: <Repeat className="w-5 h-5 text-purple-400" />,
      title: 'Auto-rebalanced portfolio',
      amount: 'Optimized',
      time: '1 day ago',
      color: 'text-purple-400'
    },
    {
      type: 'achievement',
      icon: <Award className="w-5 h-5 text-yellow-400" />,
      title: 'Unlocked "Week Warrior"',
      amount: '+100 pts',
      time: '2 days ago',
      color: 'text-yellow-400'
    },
  ];

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-gray-800/30 via-gray-900/50 to-black/70 border-2 border-amber-800/40 rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 rounded-xl backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-amber-900/20 hover:border-amber-700/40 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl backdrop-blur-sm bg-white/10 border border-amber-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              {activity.icon}
            </div>
            <div className="flex-1">
              <div className="font-semibold mb-1 text-white">{activity.title}</div>
              <div className="text-sm text-gray-400">{activity.time}</div>
            </div>
            <div className={`font-bold ${activity.color}`}>
              {activity.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
