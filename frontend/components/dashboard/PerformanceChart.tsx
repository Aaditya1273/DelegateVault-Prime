'use client';

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PerformanceChart() {
  // Generate mock data for 30 days
  const generateData = () => {
    const data = [];
    const startValue = 100000;
    let currentValue = startValue;

    for (let i = 0; i < 30; i++) {
      const change = (Math.random() - 0.4) * 2000; // Slight upward bias
      currentValue += change;
      
      data.push({
        date: `Day ${i + 1}`,
        value: Math.round(currentValue),
        apy: (12 + Math.random() * 8).toFixed(2),
      });
    }
    return data;
  };

  const data = generateData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-dark rounded-xl p-4 border border-white/20">
          <p className="text-sm text-gray-400 mb-1">{payload[0].payload.date}</p>
          <p className="text-lg font-bold text-white mb-1">
            ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-blue-400">
            APY: {payload[0].payload.apy}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: '12px' }}
            interval={4}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#0ea5e9" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
