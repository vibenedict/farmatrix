"use client";

import React from "react";
import { Droplets, Thermometer, Wind, Sun } from "lucide-react";

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
    stroke: "#059669", // rich emerald
    icon: Droplets,
    badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
  };

  if (type === "temp") {
    colorScheme = {
      stroke: value > 32 ? "#d97706" : "#0284c7",
      icon: Thermometer,
      badgeBg: value > 32 ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-sky-50 text-sky-800 border-sky-200",
    };
  } else if (type === "humidity") {
    colorScheme = {
      stroke: "#0891b2",
      icon: Wind,
      badgeBg: "bg-cyan-50 text-cyan-800 border-cyan-200",
    };
  } else if (type === "light") {
    colorScheme = {
      stroke: "#ca8a04",
      icon: Sun,
      badgeBg: "bg-yellow-50 text-yellow-800 border-yellow-200",
    };
  } else if (type === "water") {
    colorScheme = {
      stroke: "#2563eb",
      icon: Droplets,
      badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
    };
  }

  const Icon = colorScheme.icon;

  let isOptimal = true;
  if (targetRange) {
    isOptimal = value >= targetRange[0] && value <= targetRange[1];
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
              {value}
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">{unit}</span>
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
              stroke="#e2e8f0"
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
            <Icon className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Target range indicator bar */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1.5">
          {isOptimal ? (
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
          ) : (
            <span className="flex h-2 w-2 rounded-full bg-amber-500 ring-2 ring-amber-100" />
          )}
          <span className="text-[11px] text-slate-700 font-semibold">
            {statusText || (isOptimal ? "In Optimal Range" : "Threshold Trigger")}
          </span>
        </div>

        {targetRange && (
          <span className="text-[10px] text-slate-400 font-mono font-medium">
            Target: {targetRange[0]}-{targetRange[1]}{unit}
          </span>
        )}
      </div>
    </div>
  );
}
