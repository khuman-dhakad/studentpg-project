'use client';

import React from 'react';

interface PGStatusDonutChartProps {
  approved?: number;
  pending?: number;
  rejected?: number;
  draft?: number;
  total?: number;
}

export function PGStatusDonutChart({
  approved = 180,
  pending = 12,
  rejected = 18,
  draft = 38,
  total,
}: PGStatusDonutChartProps) {
  const calculatedTotal = total ?? (approved + pending + rejected + draft || 248);
  const safeTotal = calculatedTotal > 0 ? calculatedTotal : 1;

  const appPct = Math.round((approved / safeTotal) * 100);
  const pendPct = Math.round((pending / safeTotal) * 100);
  const rejPct = Math.round((rejected / safeTotal) * 100);
  const draftPct = Math.max(0, 100 - (appPct + pendPct + rejPct));

  // SVG circular arc calculations
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { label: 'Approved', count: approved, pct: appPct, color: '#059669', dotColor: 'bg-emerald-600' },
    { label: 'Pending', count: pending, pct: pendPct, color: '#f59e0b', dotColor: 'bg-amber-500' },
    { label: 'Rejected', count: rejected, pct: rejPct, color: '#ef4444', dotColor: 'bg-rose-500' },
    { label: 'Draft', count: draft, pct: draftPct, color: '#94a3b8', dotColor: 'bg-slate-400' },
  ];

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center justify-between w-full h-full pt-2">
      {/* DONUT SVG WITH CENTER NUMBER */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {segments.map((seg, i) => {
            const strokeDasharray = `${(seg.pct / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += seg.pct;

            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {/* Center cutout content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            {calculatedTotal}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
            Total
          </span>
        </div>
      </div>

      {/* LEGEND ROWS */}
      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 mt-4 pt-2 border-t border-slate-100 text-xs">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${seg.dotColor}`} />
              <span className="text-slate-600 font-medium truncate">{seg.label}</span>
            </div>
            <span className="font-bold text-slate-800 text-[11px] shrink-0 ml-1">
              {seg.count} <span className="text-slate-400 font-normal">({seg.pct}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
