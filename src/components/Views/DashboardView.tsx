"use client";

import React from "react";
import { SensorReading } from "@/lib/types";
import { 
  Cpu, 
  Terminal, 
  BarChart3, 
  Droplets, 
  Thermometer, 
  Wind, 
  Zap,
  Play,
  Square
} from "lucide-react";

interface DashboardViewProps {
  moisture: number;
  temperature: number;
  humidity: number;
  isPumpRunning: boolean;
  onTogglePump: () => void;
  onOpenSimulator: () => void;
  onOpenGateway: () => void;
  onOpenPwCInsights?: () => void;
  serialLogs?: string[];
  historicalReadings?: SensorReading[];
}

export function DashboardView({
  moisture = 34,
  temperature = 28.4,
  humidity = 62,
  isPumpRunning = false,
  onTogglePump,
  onOpenSimulator,
  onOpenGateway,
  onOpenPwCInsights,
  serialLogs = [
    "[08:00:12] BAUD 9600 OK — ARDUINO UNO R3 INITIALIZED",
    "[08:00:15] READ SOIL: 34% (V: 2.1V / CAPACITIVE PROBE V1.2)",
    "[08:00:18] DHT22 SENSOR: TEMP: 28.4C | HUM: 62%",
    "[08:00:20] WARN: SOIL MOISTURE < 45% THRESHOLD CUTOFF",
    "[08:00:22] RELAY PIN D7: TRIGGERED AUTO IRRIGATION CYCLE",
    "[08:15:00] NEAR TX: 0x9f3k...89a1 IMMUTABLE MINT OK",
    "[08:22:45] SYNC: SUPABASE EDGE DB SYNCHRONIZED (LATENCY 18ms)",
  ],
}: DashboardViewProps) {
  // Chart points for 24h curve
  const timeLabels = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
  const moisturePoints = [62, 55, 48, 41, 35, moisture, 58, 54];
  const tempPoints = [19, 18, 21, 26, temperature, 29, 24, 21];

  // SVG Chart path calculation
  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const getCoordinates = (values: number[], minVal: number, maxVal: number) => {
    const stepX = (width - paddingX * 2) / (values.length - 1);
    return values.map((val, idx) => {
      const x = paddingX + idx * stepX;
      const normalized = (val - minVal) / (maxVal - minVal);
      const y = height - paddingY - normalized * (height - paddingY * 2);
      return { x, y, val };
    });
  };

  const moistureCoords = getCoordinates(moisturePoints, 20, 80);
  const tempCoords = getCoordinates(tempPoints, 10, 40);

  const buildPathString = (coords: Array<{ x: number; y: number }>) => {
    return coords.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = coords[i - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
    }, "");
  };

  const moisturePath = buildPathString(moistureCoords);
  const tempPath = buildPathString(tempCoords);
  const moistureAreaPath = `${moisturePath} L ${moistureCoords[moistureCoords.length - 1].x} ${height - paddingY} L ${moistureCoords[0].x} ${height - paddingY} Z`;

  const isDryAlert = moisture < 45;

  return (
    <section id="screen-dashboard" className="screen-view relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Bar */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-enterprise-glassBorder">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Executive Telemetry & Field Operations
            </h2>
            <p className="text-xs text-enterprise-textSecondary mt-1">
              Live USB serial telemetry from Arduino UNO edge nodes, capacitive probes, and 5V relay actuators.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenPwCInsights && (
              <button
                onClick={onOpenPwCInsights}
                className="px-3.5 py-2.5 rounded-xl glass-panel glass-panel-hover text-enterprise-mint font-bold text-xs flex items-center gap-1.5 border border-enterprise-accent/30 cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-enterprise-accent" />
                <span>PwC ESG Insights</span>
              </button>
            )}

            <button
              onClick={onOpenSimulator}
              className="px-3.5 py-2.5 rounded-xl glass-panel glass-panel-hover text-white font-bold text-xs flex items-center gap-1.5 border border-enterprise-glassBorder cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-enterprise-accent" />
              <span>Simulate Node</span>
            </button>

            <button
              onClick={onTogglePump}
              id="pumpBtn"
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                isPumpRunning
                  ? "bg-enterprise-rust text-white shadow-lg animate-pulse"
                  : "bg-enterprise-accent hover:bg-emerald-500 text-enterprise-void shadow-glow-emerald"
              }`}
            >
              {isPumpRunning ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>OVERRIDE: STOP PUMP</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>OVERRIDE PUMP: ON</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Telemetry KPI Widget Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Soil Moisture */}
          <div className="glass-panel p-5 rounded-2xl border border-enterprise-glassBorder relative overflow-hidden">
            <div className="flex justify-between items-center text-xs text-enterprise-textSecondary mb-2">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-enterprise-accent" />
                Soil Moisture
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isDryAlert
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {isDryAlert ? "Dry Alert" : "Optimal"}
              </span>
            </div>
            <p id="dashboardMoisture" className="text-3xl font-extrabold text-white">
              {moisture}%
            </p>
            <div className="w-full bg-enterprise-void h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isDryAlert ? "bg-amber-500" : "bg-enterprise-accent"
                }`}
                style={{ width: `${Math.min(100, Math.max(0, moisture))}%` }}
              />
            </div>
            <p className="text-[10px] text-enterprise-textSecondary mt-2 font-mono">
              Probe: Capacitive V1.2 (ADC Pin A0)
            </p>
          </div>

          {/* Card 2: Ambient Temp */}
          <div className="glass-panel p-5 rounded-2xl border border-enterprise-glassBorder relative overflow-hidden">
            <div className="flex justify-between items-center text-xs text-enterprise-textSecondary mb-2">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Ambient Temp
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Optimal
              </span>
            </div>
            <p className="text-3xl font-extrabold text-white">
              {temperature.toFixed(1)}°C
            </p>
            <div className="w-full bg-enterprise-void h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-enterprise-accent h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (temperature / 45) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-enterprise-textSecondary mt-2 font-mono">
              Sensor: DHT22 Node (Pin D2)
            </p>
          </div>

          {/* Card 3: Air Humidity */}
          <div className="glass-panel p-5 rounded-2xl border border-enterprise-glassBorder relative overflow-hidden">
            <div className="flex justify-between items-center text-xs text-enterprise-textSecondary mb-2">
              <span className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-blue-400" />
                Air Humidity
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Balanced
              </span>
            </div>
            <p className="text-3xl font-extrabold text-white">
              {humidity}%
            </p>
            <div className="w-full bg-enterprise-void h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, humidity))}%` }}
              />
            </div>
            <p className="text-[10px] text-enterprise-textSecondary mt-2 font-mono">
              Relative Air Moisture (RH)
            </p>
          </div>

          {/* Card 4: 5V Pump Relay */}
          <div className="glass-panel p-5 rounded-2xl border border-enterprise-glassBorder relative overflow-hidden">
            <div className="flex justify-between items-center text-xs text-enterprise-textSecondary mb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-enterprise-mint" />
                5V Pump Relay
              </span>
              <span
                id="pumpBadge"
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                  isPumpRunning
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    : "bg-enterprise-surface text-enterprise-mint"
                }`}
              >
                {isPumpRunning ? "PUMPING ACTIVE" : "AUTO THRESHOLD"}
              </span>
            </div>
            <p
              id="pumpText"
              className={`text-2xl font-extrabold mt-1 font-mono tracking-tight ${
                isPumpRunning ? "text-blue-400" : "text-white"
              }`}
            >
              {isPumpRunning ? "RUNNING" : "STANDBY"}
            </p>
            <p className="text-[10px] text-enterprise-textSecondary mt-4 font-mono">
              {isPumpRunning ? "Pin D7 Signal: HIGH (Actuator ON)" : "Pin D7 Signal: LOW (Normally Open)"}
            </p>
          </div>

        </div>

        {/* Real-Time Telemetry Chart & Hardware Console */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 24h Dual Line Chart */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4 border border-enterprise-glassBorder">
            <div className="flex items-center justify-between border-b border-enterprise-glassBorder pb-3">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-white text-sm">Real-Time Sensor Telemetry Stream (24h)</h3>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-enterprise-accent">
                    <span className="w-2.5 h-1 bg-enterprise-accent rounded-full inline-block" />
                    Soil Moisture (%)
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-2.5 h-1 bg-amber-400 rounded-full inline-block" />
                    Ambient Temp (°C)
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-enterprise-mint">Supabase Edge Sync</span>
            </div>

            {/* SVG responsive interactive chart */}
            <div className="h-64 w-full relative">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                {[0.25, 0.5, 0.75, 1].map((r, i) => (
                  <line
                    key={i}
                    x1={paddingX}
                    y1={height - paddingY - r * (height - paddingY * 2)}
                    x2={width - paddingX}
                    y2={height - paddingY - r * (height - paddingY * 2)}
                    stroke="rgba(16, 185, 129, 0.08)"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Shaded Area under Moisture */}
                <path d={moistureAreaPath} fill="url(#moistureGradient)" />

                {/* Soil Moisture Curve */}
                <path
                  d={moisturePath}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Ambient Temp Curve */}
                <path
                  d={tempPath}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />

                {/* Dots on Moisture Curve */}
                {moistureCoords.map((pt, i) => (
                  <circle
                    key={`m-${i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={i === 5 ? "5" : "3.5"}
                    fill="#10B981"
                    stroke="#01140E"
                    strokeWidth="2"
                    className="transition-all hover:scale-150 cursor-pointer"
                  >
                    <title>{`Soil Moisture: ${pt.val}% at ${timeLabels[i]}`}</title>
                  </circle>
                ))}

                {/* X-axis labels */}
                {timeLabels.map((label, i) => {
                  const stepX = (width - paddingX * 2) / (timeLabels.length - 1);
                  const x = paddingX + i * stepX;
                  return (
                    <text
                      key={label}
                      x={x}
                      y={height - 8}
                      fill="#94A3B8"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="Plus Jakarta Sans"
                    >
                      {label}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Hardware Serial Output */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 border border-enterprise-glassBorder flex flex-col">
            <div className="flex items-center justify-between border-b border-enterprise-glassBorder pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Hardware Serial Output
              </h3>
              <button
                onClick={onOpenGateway}
                className="text-[10px] text-enterprise-mint font-mono hover:underline cursor-pointer"
              >
                USB Bridge Config
              </button>
            </div>

            <div className="p-4 bg-black/80 rounded-2xl font-mono text-[11px] text-emerald-400 space-y-1.5 h-64 overflow-y-auto no-scrollbar border border-enterprise-glassBorder flex-1">
              {serialLogs.map((log, i) => (
                <p
                  key={i}
                  className={
                    log.includes("WARN")
                      ? "text-amber-400 font-semibold"
                      : log.includes("NEAR")
                      ? "text-indigo-300 font-semibold"
                      : log.includes("RELAY")
                      ? "text-blue-300"
                      : "text-emerald-400"
                  }
                >
                  {log}
                </p>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
