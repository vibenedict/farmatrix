"use client";

import React from "react";
import { Droplets, Thermometer, Wind, Sun, AlertTriangle, ShieldCheck, Zap } from "lucide-react";

interface LiveGaugeProps {
  title: string;
  value: number;
  unit: string;
  subValue?: string;
  min: number;
  max: number;
  targetRange?: [number, number]; // [minTarget, maxTarget]
  type: "moisture" | "temp" | "humidity" | "light" | "water";
  statusText?: string;
}

export function LiveGauge({
  title,
  value,
  unit,
  subValue,
  min,
  max,
  targetRange,
  type,
  statusText,
}: LiveGaugeProps) {
  // SVG circular arc calculation
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75; // 270 degree arc

  let colorScheme = {
    stroke: "#10b981", // emerald
    bgGlow: "from-emerald-500/20 to-teal-500/5",
    icon: Droplets,
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  };

  if (type === "temp") {
    colorScheme = {
      stroke: value > 32 ? "#f59e0b" : "#38bdf8",
      bgGlow: "from-amber-500/20 to-orange-500/5",
      icon: Thermometer,
      statusColor: value > 32 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-sky-400 bg-sky-500/10 border-sky-500/20",
    };
  } else if (type === "humidity") {
    colorScheme = {
      stroke: "#06b6d4",
      bgGlow: "from-cyan-500/20 to-blue-500/5",
      icon: Wind,
      statusColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    };
  } else if (type === "light") {
    colorScheme = {
      stroke: "#eab308",
      bgGlow: "from-yellow-500/20 to-amber-500/5",
      icon: Sun,
      statusColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    };
  } else if (type === "water") {
    colorScheme = {
      stroke: "#6366f1",
      bgGlow: "from-indigo-500/20 to-blue-500/5",
      icon: Droplets,
      statusColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    };
  }

  const Icon = colorScheme.icon;

  // Determine if in target
  let isOptimal = true;
  if (targetRange) {
    isOptimal = value >= targetRange[0] && value <= targetRange[1];
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-4 shadow-xl backdrop-blur-xl">
      {/* Background ambient radial glow */}
      <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${colorScheme.bgGlow} blur-2xl pointer-events-none`} />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-mono">
              {value}
            </span>
            <span className="text-xs font-semibold text-slate-400 font-mono">{unit}</span>
          </div>
          {subValue && (
            <div className="mt-0.5 text-[11px] text-slate-400 font-mono">{subValue}</div>
          )}
        </div>

        {/* Circular Dial Visualizer */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference * 0.75}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            {/* Active gauge bar */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={colorScheme.stroke}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference * 0.75}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="h-5 w-5 text-slate-300" />
          </div>
        </div>
      </div>

      {/* Target range indicator bar */}
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex items-center gap-1.5">
          {isOptimal ? (
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
          ) : (
            <span className="flex h-2 w-2 rounded-full bg-amber-400 ring-2 ring-amber-500/20" />
          )}
          <span className="text-[11px] text-slate-300 font-medium">
            {statusText || (isOptimal ? "In Optimal Range" : "Threshold Trigger")}
          </span>
        </div>

        {targetRange && (
          <span className="text-[10px] text-slate-400 font-mono">
            Target: {targetRange[0]}-{targetRange[1]}{unit}
          </span>
        )}
      </div>
    </div>
  );
}
