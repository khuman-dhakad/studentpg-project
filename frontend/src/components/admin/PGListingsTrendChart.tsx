'use client';

import React, { useState } from 'react';
import { MonthlyTrendItem } from '@/types/admin.types';

interface PGListingsTrendChartProps {
  data?: MonthlyTrendItem[];
  selectedRange?: string;
  onRangeChange?: (range: string) => void;
}

export function PGListingsTrendChart({
  data,
}: PGListingsTrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Default baseline data matching reference screenshot
  const defaultItems: MonthlyTrendItem[] = [
    { month: 'Jan', year: 2026, count: 42 },
    { month: 'Feb', year: 2026, count: 80 },
    { month: 'Mar', year: 2026, count: 56 },
    { month: 'Apr', year: 2026, count: 92 },
    { month: 'May', year: 2026, count: 81 },
    { month: 'Jun', year: 2026, count: 120 },
    { month: 'Jul', year: 2026, count: 134 },
    { month: 'Aug', year: 2026, count: 180 },
  ];

  const items = data && data.length > 0 ? data : defaultItems;

  const width = 500;
  const height = 210;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const maxVal = 200;

  const points = items.map((item, idx) => {
    const x = padLeft + (idx / Math.max(1, items.length - 1)) * chartW;
    const clampedCount = Math.max(0, Math.min(maxVal, item.count));
    const y = padTop + chartH - (clampedCount / maxVal) * chartH;
    return { x, y, item, idx };
  });

  // Generate smooth cubic bezier spline path
  const linePath = points.reduce((acc, curr, i, arr) => {
    if (i === 0) return `M ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
    const prev = arr[i - 1];
    const cpX1 = (prev.x + (curr.x - prev.x) / 2).toFixed(1);
    const cpY1 = prev.y.toFixed(1);
    const cpX2 = (prev.x + (curr.x - prev.x) / 2).toFixed(1);
    const cpY2 = curr.y.toFixed(1);
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }, '');

  const firstPt = points[0];
  const lastPt = points[points.length - 1];
  const areaPath = `${linePath} L ${lastPt.x.toFixed(1)} ${(padTop + chartH).toFixed(1)} L ${firstPt.x.toFixed(1)} ${(padTop + chartH).toFixed(1)} Z`;

  const yTicks = [200, 150, 100, 50, 0];

  return (
    <div className="w-full flex flex-col">
      <div className="relative w-full aspect-[2.4/1] min-h-[220px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y labels */}
          {yTicks.map((val) => {
            const y = padTop + chartH - (val / maxVal) * chartH;
            return (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? undefined : '3 3'}
                />
                <text
                  x={padLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-medium"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill under curve */}
          <path d={areaPath} fill="url(#trendGradient)" />

          {/* Emerald curve line */}
          <path
            d={linePath}
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X axis labels and data markers */}
          {points.map((pt) => {
            const isHovered = hoveredIdx === pt.idx;
            return (
              <g key={pt.idx}>
                {/* Node marker */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill="#059669"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(pt.idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />

                {/* X month label */}
                <text
                  x={pt.x}
                  y={height - 10}
                  textAnchor="middle"
                  className={`text-[10px] font-medium transition-colors ${
                    isHovered ? 'fill-emerald-700 font-bold' : 'fill-slate-500'
                  }`}
                >
                  {pt.item.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div
            className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-bold text-white shadow-lg transition-all"
            style={{
              left: `${(points[hoveredIdx].x / width) * 100}%`,
              top: `${(points[hoveredIdx].y / height) * 100 - 6}%`,
            }}
          >
            <span className="text-emerald-400">
              {points[hoveredIdx].item.month}:
            </span>{' '}
            {points[hoveredIdx].item.count} Listings
          </div>
        )}
      </div>
    </div>
  );
}
