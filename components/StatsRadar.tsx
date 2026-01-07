import React from 'react';
import { UserStats } from '../types';

interface StatsRadarProps {
  stats: UserStats;
  size?: number;
}

const StatsRadar: React.FC<StatsRadarProps> = ({ stats, size = 200 }) => {
  // Defensive check: if stats object is missing, don't render
  if (!stats) return null;

  // Destructure with defaults to ensure no NaN values
  const { str = 0, int = 0, foc = 0, spi = 0, cha = 0 } = stats;

  // Normalize stats to 0-100 for the chart (assuming max stat is 100 for visual balance)
  const maxVal = 100;
  
  const data = [
    { label: 'STR', value: Number(str), color: '#10b981' }, // Body - Green
    { label: 'INT', value: Number(int), color: '#3b82f6' }, // Mind - Blue
    { label: 'FOC', value: Number(foc), color: '#a855f7' }, // Work - Purple
    { label: 'SPI', value: Number(spi), color: '#f59e0b' }, // Spirit - Orange
    { label: 'CHA', value: Number(cha), color: '#ec4899' }, // Life - Pink
  ];

  const count = data.length;
  const center = size / 2;
  const radius = (size / 2) - 40; // Padding for labels
  const angleSlice = (Math.PI * 2) / count;

  // Calculate points for the polygon
  const points = data.map((d, i) => {
    const angle = i * angleSlice - Math.PI / 2; // Start at top
    const valueRatio = Math.min(Math.max(d.value, 0), maxVal) / maxVal; // Clamp between 0 and 1
    const r = radius * valueRatio;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    // Ensure no NaN
    if (isNaN(x) || isNaN(y)) return `${center},${center}`;
    return `${x},${y}`;
  }).join(' ');

  // Calculate points for the background grid (concentric pentagons)
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridPoints = gridLevels.map(level => {
    return data.map((_, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const r = radius * level;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  });

  // Calculate label positions
  const labelPoints = data.map((d, i) => {
    const angle = i * angleSlice - Math.PI / 2;
    const r = radius + 25; // Push labels out
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, label: d.label, color: d.color, value: d.value };
  });

  return (
    <div className="relative flex justify-center items-center py-4">
        {/* Background glow behind chart */}
        <div className="absolute inset-0 bg-neon-purple/5 blur-3xl rounded-full"></div>

        <svg width={size} height={size} className="overflow-visible">
            {/* Background Grid */}
            {gridPoints.map((pointsStr, i) => (
                <polygon 
                    key={`grid-${i}`} 
                    points={pointsStr} 
                    fill="none" 
                    stroke="#1f2937" 
                    strokeWidth="1" 
                />
            ))}
            
            {/* Axis Lines */}
            {data.map((_, i) => {
                const angle = i * angleSlice - Math.PI / 2;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                return (
                    <line 
                        key={`axis-${i}`} 
                        x1={center} 
                        y1={center} 
                        x2={x} 
                        y2={y} 
                        stroke="#1f2937" 
                        strokeWidth="1" 
                    />
                );
            })}

            {/* The Stats Polygon */}
            <polygon 
                points={points} 
                fill="rgba(168, 85, 247, 0.3)" 
                stroke="#a855f7" 
                strokeWidth="2"
                className="drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
            >
                <animate attributeName="opacity" from="0" to="1" dur="1s" />
            </polygon>
            
            {/* Corner Dots */}
            {data.map((d, i) => {
                const angle = i * angleSlice - Math.PI / 2;
                const valueRatio = Math.min(Math.max(d.value, 0), maxVal) / maxVal;
                const r = radius * valueRatio;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);
                return (
                    <circle key={`dot-${i}`} cx={x} cy={y} r="3" fill="white" />
                );
            })}

            {/* Labels */}
            {labelPoints.map((p, i) => (
                <g key={`label-${i}`}>
                    <text 
                        x={p.x} 
                        y={p.y} 
                        textAnchor="middle" 
                        dominantBaseline="middle" 
                        fill={p.color}
                        className="text-[10px] font-bold font-display tracking-widest uppercase"
                        style={{ textShadow: `0 0 10px ${p.color}` }}
                    >
                        {p.label}
                    </text>
                    <text 
                        x={p.x} 
                        y={p.y + 12} 
                        textAnchor="middle" 
                        dominantBaseline="middle" 
                        fill="#6b7280"
                        className="text-[8px] font-mono"
                    >
                        {p.value}
                    </text>
                </g>
            ))}
        </svg>
    </div>
  );
};

export default StatsRadar;