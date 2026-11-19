import React, { useState } from 'react';

export interface SeriesPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export const AreaTrendChart: React.FC<{
  data: SeriesPoint[];
  primaryLabel: string;
  color?: string;
  height?: number;
}> = ({ data, primaryLabel, color = 'var(--agency-primary)', height = 190 }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  if (!data.length) return null;

  const width = 560;
  const padX = 28;
  const padY = 18;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2 - 18;
  const maxVal = Math.max(...data.map((d) => d.value), 1) * 1.15;

  const coords = data.map((d, i) => {
    const x = padX + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
    const y = padY + innerH - (d.value / maxVal) * innerH;
    return { x, y, ...d };
  });

  const linePath = coords.map((c, idx) => `${idx === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${padY + innerH} L ${coords[0].x} ${padY + innerH} Z`;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="areaFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.20" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = padY + innerH * ratio;
          const val = Math.round(maxVal * (1 - ratio));
          return (
            <g key={idx}>
              <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
              <text x={padX - 6} y={y + 3} textAnchor="end" className="fill-slate-400 text-[10px] font-mono-num">
                {val}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#areaFillGrad)" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

        {coords.map((c, idx) => (
          <g
            key={c.label + idx}
            onMouseEnter={() => setHoverIdx(idx)}
            onMouseLeave={() => setHoverIdx(null)}
            className="cursor-pointer"
          >
            <circle
              cx={c.x}
              cy={c.y}
              r={hoverIdx === idx ? 5 : 3.2}
              fill="#FFFFFF"
              stroke={color}
              strokeWidth="2.2"
            />
            <text
              x={c.x}
              y={height - 4}
              textAnchor="middle"
              className="fill-slate-500 text-[10px]"
            >
              {c.label}
            </text>
          </g>
        ))}

        {hoverIdx !== null && coords[hoverIdx] && (
          <g transform={`translate(${Math.min(Math.max(coords[hoverIdx].x - 45, 10), width - 105)}, ${Math.max(coords[hoverIdx].y - 38, 2)})`}>
            <rect width="92" height="28" rx="6" fill="#0F172A" />
            <text x="46" y="18" textAnchor="middle" className="fill-white text-[11px] font-semibold font-mono-num">
              {coords[hoverIdx].label}: {coords[hoverIdx].value}
            </text>
          </g>
        )}
      </svg>
      <div className="mt-1 flex items-center justify-end gap-2 text-xs font-medium text-zinc-700">
        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span>{primaryLabel}</span>
      </div>
    </div>
  );
};

export const BarComparisonChart: React.FC<{
  data: SeriesPoint[];
  primaryLabel: string;
  secondaryLabel?: string;
  primaryColor?: string;
  secondaryColor?: string;
  height?: number;
}> = ({
  data,
  primaryLabel,
  secondaryLabel,
  primaryColor = 'var(--agency-primary)',
  secondaryColor = 'var(--agency-accent)',
  height = 195,
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  if (!data.length) return null;

  const width = 560;
  const padX = 30;
  const padY = 16;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2 - 20;
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.value, d.secondaryValue ?? 0)),
    1
  ) * 1.15;

  const groupW = innerW / data.length;
  const hasSecondary = data.some((d) => typeof d.secondaryValue === 'number');
  const barW = hasSecondary ? Math.min(18, groupW * 0.28) : Math.min(26, groupW * 0.45);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {[0, 0.5, 1].map((ratio, i) => {
          const y = padY + innerH * ratio;
          const val = Math.round(maxVal * (1 - ratio));
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="#E4E4E7" strokeDasharray="3 3" />
              <text x={padX - 6} y={y + 3} textAnchor="end" className="fill-zinc-500 text-[10px] font-mono-num">
                {val}
              </text>
            </g>
          );
        })}

        {data.map((d, idx) => {
          const cx = padX + idx * groupW + groupW / 2;
          const h1 = (d.value / maxVal) * innerH;
          const y1 = padY + innerH - h1;
          const h2 = ((d.secondaryValue ?? 0) / maxVal) * innerH;
          const y2 = padY + innerH - h2;

          return (
            <g
              key={d.label + idx}
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(null)}
              className="cursor-pointer"
            >
              <rect
                x={hasSecondary ? cx - barW - 2 : cx - barW / 2}
                y={y1}
                width={barW}
                height={Math.max(h1, 2)}
                rx="4"
                fill={primaryColor}
                opacity={hoverIdx === null || hoverIdx === idx ? 1 : 0.6}
              />
              {hasSecondary && (
                <rect
                  x={cx + 2}
                  y={y2}
                  width={barW}
                  height={Math.max(h2, 2)}
                  rx="4"
                  fill={secondaryColor}
                  opacity={hoverIdx === null || hoverIdx === idx ? 1 : 0.6}
                />
              )}
              <text x={cx} y={height - 4} textAnchor="middle" className="fill-zinc-700 font-medium text-[10px]">
                {d.label}
              </text>
              {hoverIdx === idx && (
                <g transform={`translate(${Math.min(Math.max(cx - 52, 6), width - 110)}, ${Math.max(Math.min(y1, y2) - 30, 2)})`}>
                  <rect width="104" height="24" rx="5" fill="#09090B" />
                  <text x="52" y="16" textAnchor="middle" className="fill-white text-[10px] font-mono-num">
                    {hasSecondary ? `${d.value} / ${d.secondaryValue}` : d.value}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      <div className="mt-1 flex items-center justify-end gap-4 text-xs font-medium text-zinc-700">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: primaryColor }} />
          {primaryLabel}
        </span>
        {secondaryLabel && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: secondaryColor }} />
            {secondaryLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export const DonutDistributionChart: React.FC<{
  slices: DonutSlice[];
  centerValue: string | number;
  centerLabel: string;
}> = ({ slices, centerValue, centerLabel }) => {
  const total = Math.max(
    slices.reduce((sum, s) => sum + s.value, 0),
    1
  );
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#F4F4F5" strokeWidth="16" />
          {slices.map((slice) => {
            const pct = slice.value / total;
            const dash = pct * circumference;
            const offset = -accumulated * circumference;
            accumulated += pct;
            return (
              <circle
                key={slice.label}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth="16"
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={offset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-zinc-950 tabular-nums">{centerValue}</span>
          <span className="text-[11px] font-medium text-zinc-600">{centerLabel}</span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2">
        {slices.map((slice) => {
          const pct = Math.round((slice.value / total) * 100);
          return (
            <div key={slice.label} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-zinc-900 font-medium truncate">{slice.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 tabular-nums">
                <span className="font-bold text-zinc-950">{slice.value}</span>
                <span className="text-zinc-500 w-9 text-end">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ConversionFunnelChart: React.FC<{
  stages: { label: string; count: number; color: string }[];
}> = ({ stages }) => {
  const topCount = Math.max(stages[0]?.count ?? 1, 1);

  return (
    <div className="space-y-3">
      {stages.map((stage, idx) => {
        const pct = Math.round((stage.count / topCount) * 100);
        return (
          <div key={stage.label + idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-900">{stage.label}</span>
              <span className="tabular-nums text-zinc-950 font-bold">
                {stage.count}{' '}
                <span className="text-zinc-500 font-normal">({pct}%)</span>
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.max(pct, 6)}%`,
                  backgroundColor: stage.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
