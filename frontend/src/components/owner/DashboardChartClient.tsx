'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PG } from '@/types/pg.types';

interface DashboardChartClientProps {
  data: PG[];
}

export default function DashboardChartClient({ data }: DashboardChartClientProps) {

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center border border-dashed border-slate-100 rounded-xl bg-slate-50/50">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">No data available for chart</p>
      </div>
    );
  }

  // आपके रियल पीजी डेटा को ग्राफ के फॉर्मेट में मैप करना
  const chartData = data.map((item) => ({
    name: item.pgName.length > 10 ? `${item.pgName.substring(0, 10)}...` : item.pgName,
    Rent: item.rent || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
        />
        <Area type="monotone" dataKey="Rent" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRent)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}