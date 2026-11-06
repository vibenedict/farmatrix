"use client";

import React, { useState } from "react";
import { SensorReading } from "@/lib/types";
import { Activity, Clock } from "lucide-react";

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

  // For Temp & Hum: Temp 15C - 45C, Hum 0% - 100%
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">
              Real-Time IoT Telemetry Stream (Arduino UNO R3)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous soil-climate monitoring with automated threshold triggers & relay actuation
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveMetric("moisture")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeMetric === "moisture"
                ? "bg-white text-emerald-900 shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Soil Moisture (%)
          </button>
          <button
            onClick={() => setActiveMetric("temp_hum")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeMetric === "temp_hum"
                ? "bg-white text-slate-900 shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
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
            {/* Soft Green Area Gradient */}
            <linearGradient id="moistureGradientLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
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
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-mono"
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
                stroke="#e11d48"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <text
                x={width - padding.right}
                y={lowThresholdY - 6}
                textAnchor="end"
                className="fill-rose-600 text-[10px] font-mono font-bold"
              >
                Pump Trigger Threshold (&lt;{lowThreshold}%)
              </text>

              {/* Threshold Band (Pump OFF cutoff > highThreshold) */}
              <line
                x1={padding.left}
                y1={highThresholdY}
                x2={width - padding.right}
                y2={highThresholdY}
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <text
                x={width - padding.right}
                y={highThresholdY - 6}
                textAnchor="end"
                className="fill-sky-700 text-[10px] font-mono font-bold"
              >
                Cutoff Threshold (&gt;{highThreshold}%)
              </text>

              {/* Filled area */}
              <path d={moistureArea} fill="url(#moistureGradientLight)" />

              {/* Smooth Moisture Line */}
              <path
                d={moisturePath}
                fill="none"
                stroke="#059669"
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
                      fill={isPumpOn ? "#047857" : "#059669"}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </>
          ) : (
            <>
              {/* Temperature line */}
              <path
                d={tempPath}
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Humidity line */}
              <path
                d={humPath}
                fill="none"
                stroke="#0d9488"
                strokeWidth="2"
                strokeDasharray="4 2"
                strokeLinecap="round"
              />
              {data.map((d, i) => (
                <g key={d.id} onMouseEnter={() => setHoverIndex(i)} className="cursor-pointer">
                  <circle
                    cx={getX(i)}
                    cy={getYTemp(d.temperature)}
                    r={3}
                    fill="#0284c7"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={getX(i)}
                    cy={getYHum(d.humidity)}
                    r={3}
                    fill="#0d9488"
                    stroke="#ffffff"
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
              stroke="#94a3b8"
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
                className="fill-slate-500 text-[10px] font-mono"
              >
                {time}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredItem && (
          <div className="mt-3 flex flex-wrap items-center justify-between rounded-xl bg-slate-900 px-4 py-2 text-xs border border-slate-800 font-mono text-white shadow-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Timestamp: {new Date(hoveredItem.recordedAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="text-emerald-400">Soil: {hoveredItem.soilMoisture}% (ADC {hoveredItem.soilMoistureRaw})</span>
              <span className="text-sky-300">Temp: {hoveredItem.temperature}°C</span>
              <span className="text-teal-300">Humidity: {hoveredItem.humidity}%</span>
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
