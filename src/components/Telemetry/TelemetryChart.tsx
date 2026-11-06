"use client";

import React, { useState } from "react";
import { SensorReading } from "@/lib/types";
import { Activity, Clock, Zap, Info } from "lucide-react";

interface TelemetryChartProps {
  readings: SensorReading[];
  lowThreshold: number;
  highThreshold: number;
}

export function TelemetryChart({ readings, lowThreshold, highThreshold }: TelemetryChartProps) {
  const [activeMetric, setActiveMetric] = useState<"moisture" | "temp_hum">("moisture");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Take the last 24 points or available
  const data = readings.slice(-24);
  if (data.length === 0) return null;

  // ViewBox dimensions
  const width = 800;
  const height = 260;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Helper scales
  const getX = (index: number) => padding.left + (index / (data.length - 1 || 1)) * graphWidth;

  // For Moisture: Y scale 0% to 100%
  const getYMoisture = (val: number) => {
    const clamped = Math.min(100, Math.max(0, val));
    return padding.top + (1 - clamped / 100) * graphHeight;
  };

  // For Temp & Hum: Temp 10C - 45C, Hum 0% - 100%
  const getYTemp = (val: number) => {
    const min = 15;
    const max = 45;
    const norm = (val - min) / (max - min);
    return padding.top + (1 - Math.max(0, Math.min(1, norm))) * graphHeight;
  };

  const getYHum = (val: number) => {
    return padding.top + (1 - val / 100) * graphHeight;
  };

  // Build SVG path
  const moisturePoints = data.map((d, i) => `${getX(i)},${getYMoisture(d.soilMoisture)}`);
  const moisturePath = `M ${moisturePoints.join(" L ")}`;
  const moistureArea = `${moisturePath} L ${getX(data.length - 1)},${padding.top + graphHeight} L ${getX(0)},${padding.top + graphHeight} Z`;

  // Temp path
  const tempPoints = data.map((d, i) => `${getX(i)},${getYTemp(d.temperature)}`);
  const tempPath = `M ${tempPoints.join(" L ")}`;

  // Hum path
  const humPoints = data.map((d, i) => `${getX(i)},${getYHum(d.humidity)}`);
  const humPath = `M ${humPoints.join(" L ")}`;

  // Threshold Y positions
  const lowThresholdY = getYMoisture(lowThreshold);
  const highThresholdY = getYMoisture(highThreshold);

  const hoveredItem = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-5 shadow-xl backdrop-blur-xl">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Real-Time IoT Telemetry Stream (Arduino UNO R3)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous soil-climate monitoring with automated threshold triggers & relay actuation
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-black/40 p-1 border border-white/5">
          <button
            onClick={() => setActiveMetric("moisture")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeMetric === "moisture"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Soil Moisture (%)
          </button>
          <button
            onClick={() => setActiveMetric("temp_hum")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeMetric === "temp_hum"
                ? "bg-sky-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            DHT22 Temp & Humidity
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative mt-4 w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Gradient for Moisture Area */}
            <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((level) => {
            const y = padding.top + (1 - level / 100) * graphHeight;
            return (
              <g key={level}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-500 text-[10px] font-mono"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {activeMetric === "moisture" ? (
            <>
              {/* Threshold Band (Pump ON trigger < lowThreshold) */}
              <line
                x1={padding.left}
                y1={lowThresholdY}
                x2={width - padding.right}
                y2={lowThresholdY}
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <text
                x={width - padding.right}
                y={lowThresholdY - 6}
                textAnchor="end"
                className="fill-rose-400 text-[10px] font-mono font-semibold"
              >
                Pump Trigger Threshold (&lt;{lowThreshold}%)
              </text>

              {/* Threshold Band (Pump OFF cutoff > highThreshold) */}
              <line
                x1={padding.left}
                y1={highThresholdY}
                x2={width - padding.right}
                y2={highThresholdY}
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <text
                x={width - padding.right}
                y={highThresholdY - 6}
                textAnchor="end"
                className="fill-cyan-400 text-[10px] font-mono font-semibold"
              >
                Cutoff Threshold (&gt;{highThreshold}%)
              </text>

              {/* Filled area */}
              <path d={moistureArea} fill="url(#moistureGradient)" />

              {/* Smooth Moisture Line */}
              <path
                d={moisturePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {data.map((d, i) => {
                const cx = getX(i);
                const cy = getYMoisture(d.soilMoisture);
                const isPumpOn = d.pumpStatus === "ON" || d.pumpStatus === "AUTO_IRRIGATING";
                return (
                  <g key={d.id} onMouseEnter={() => setHoverIndex(i)} className="cursor-pointer">
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isPumpOn ? 5 : 3}
                      fill={isPumpOn ? "#00ec97" : "#10b981"}
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                    {isPumpOn && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="8"
                        fill="none"
                        stroke="#00ec97"
                        strokeWidth="1"
                        className="animate-ping opacity-75"
                      />
                    )}
                  </g>
                );
              })}
            </>
          ) : (
            <>
              {/* Temperature line (Sky Blue) */}
              <path
                d={tempPath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Humidity line (Cyan) */}
              <path
                d={humPath}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="4 2"
                strokeLinecap="round"
              />
              {/* Dots */}
              {data.map((d, i) => (
                <g key={d.id} onMouseEnter={() => setHoverIndex(i)} className="cursor-pointer">
                  <circle
                    cx={getX(i)}
                    cy={getYTemp(d.temperature)}
                    r={3}
                    fill="#38bdf8"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={getX(i)}
                    cy={getYHum(d.humidity)}
                    r={3}
                    fill="#06b6d4"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                </g>
              ))}
            </>
          )}

          {/* Hover Crosshair */}
          {hoverIndex !== null && (
            <line
              x1={getX(hoverIndex)}
              y1={padding.top}
              x2={getX(hoverIndex)}
              y2={padding.top + graphHeight}
              stroke="rgba(255,255,255,0.4)"
              strokeDasharray="2 2"
            />
          )}

          {/* Time Labels on X axis */}
          {data.map((d, i) => {
            if (i % 4 !== 0 && i !== data.length - 1) return null;
            const time = new Date(d.recordedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            return (
              <text
                key={i}
                x={getX(i)}
                y={padding.top + graphHeight + 20}
                textAnchor="middle"
                className="fill-slate-400 text-[10px] font-mono"
              >
                {time}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredItem && (
          <div className="mt-3 flex flex-wrap items-center justify-between rounded-xl bg-black/60 px-4 py-2 text-xs border border-white/5 font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Timestamp: {new Date(hoveredItem.recordedAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="text-emerald-400">Soil: {hoveredItem.soilMoisture}% (ADC {hoveredItem.soilMoistureRaw})</span>
              <span className="text-sky-400">Temp: {hoveredItem.temperature}°C</span>
              <span className="text-cyan-400">Humidity: {hoveredItem.humidity}%</span>
              <span className={hoveredItem.pumpStatus === "ON" || hoveredItem.pumpStatus === "AUTO_IRRIGATING" ? "text-emerald-400" : "text-slate-400"}>
                Pump: {hoveredItem.pumpStatus}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
