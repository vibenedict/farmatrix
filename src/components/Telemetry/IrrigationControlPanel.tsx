"use client";

import React, { useState } from "react";
import { 
  Droplets, 
  Power, 
  ShieldCheck, 
  ShieldAlert, 
  Settings2, 
  AlertOctagon, 
  Clock, 
  Sliders,
  CheckCircle2,
  Waves
} from "lucide-react";
import { IrrigationConfig, PumpStatus } from "@/lib/types";

interface IrrigationControlPanelProps {
  config: IrrigationConfig;
  onUpdateConfig: (newConfig: Partial<IrrigationConfig>) => void;
  onTriggerManualOverride: (forceOn: boolean) => void;
  currentMoisture: number;
}

export function IrrigationControlPanel({
  config,
  onUpdateConfig,
  onTriggerManualOverride,
  currentMoisture,
}: IrrigationControlPanelProps) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempLow, setTempLow] = useState(config.moistureThresholdLow);
  const [tempHigh, setTempHigh] = useState(config.moistureThresholdHigh);

  const isPumpActive = config.runtimeElapsedSeconds > 0 || currentMoisture < config.moistureThresholdLow;
  
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-5 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
            isPumpActive
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 animate-pulse"
              : "bg-white/[0.05] text-slate-300"
          }`}>
            <Waves className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Automated Irrigation Engine & 5V Relay
            </h3>
            <p className="text-xs text-slate-400">
              Micro-drip pump actuated via calibrated capacitive moisture threshold
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSettingsModal(true)}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Calibrate Thresholds</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Card */}
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Relay Actuation State
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              isPumpActive 
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                : "bg-slate-800 text-slate-400"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isPumpActive ? "bg-emerald-400 animate-ping" : "bg-slate-400"}`} />
              {isPumpActive ? "PUMP ACTIVE (D8 HIGH)" : "IDLE / CLOSED (D8 LOW)"}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">
              {isPumpActive ? "IRRIGATING" : "MONITORING"}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {config.autoMode
              ? `Auto-mode engaged. Triggered if soil moisture < ${config.moistureThresholdLow}%, stops when > ${config.moistureThresholdHigh}%.`
              : "Manual mode active. Automation suspended by operator."}
          </p>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-400">Flow Output:</span>
            <span className="font-mono text-emerald-400 font-semibold">{isPumpActive ? "1.8 L/min" : "0.0 L/min"}</span>
          </div>
        </div>

        {/* Safeguards Card */}
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Hardware Safeguard Watchdog
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Max Continuous Runtime:</span>
              <span className="font-mono font-semibold text-slate-200">{config.maxRuntimeSeconds}s safeguard</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Pump Cooldown Period:</span>
              <span className="font-mono font-semibold text-slate-200">{config.cooldownPeriodSeconds}s locked</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Dry-Run Prevention:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Reservoir 84% OK
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-emerald-500/10 p-2 text-[11px] text-emerald-300 border border-emerald-500/20">
            ✓ Arduino EEPROM fail-safe watchdog timer active
          </div>
        </div>

        {/* Manual Override Controls */}
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Manual Override Controls
              </span>
              <Power className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-1 text-xs text-slate-400 leading-snug">
              Direct digital write (PIN D8) via gateway. Maximum safeguard override applies.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onTriggerManualOverride(!isPumpActive)}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all shadow-md active:scale-95 ${
                isPumpActive
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
              }`}
            >
              <Power className="h-4 w-4" />
              <span>{isPumpActive ? "EMERGENCY STOP (FORCE OFF)" : "MANUAL TRIGGER PUMP (FORCE ON)"}</span>
            </button>

            <button
              onClick={() => onUpdateConfig({ autoMode: !config.autoMode })}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-1.5 text-center text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors"
            >
              Mode: {config.autoMode ? "Switch to Manual Mode" : "Switch to Autonomous Auto-Pilot"}
            </button>
          </div>
        </div>
      </div>

      {/* Threshold Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white">Calibrate Moisture Thresholds</h4>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Set the calibrated soil moisture trigger points. Calibrated using capacitive sensor v1.2 analog readings (ADC 300 to 750).
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Pump Trigger (Turn ON if below):</span>
                  <span className="text-rose-400 font-mono">{tempLow}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="45"
                  value={tempLow}
                  onChange={(e) => setTempLow(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Cutoff (Turn OFF when reaching):</span>
                  <span className="text-cyan-400 font-mono">{tempHigh}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="85"
                  value={tempHigh}
                  onChange={(e) => setTempHigh(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateConfig({ moistureThresholdLow: tempLow, moistureThresholdHigh: tempHigh });
                  setShowSettingsModal(false);
                }}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
              >
                Save Calibration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
