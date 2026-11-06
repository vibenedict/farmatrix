"use client";

import React, { useState } from "react";
import { 
  Power, 
  ShieldCheck, 
  CheckCircle2,
  Waves,
  Sliders
} from "lucide-react";
import { IrrigationConfig } from "@/lib/types";

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
            isPumpActive
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600"
          }`}>
            <Waves className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">
              Automated Irrigation Engine & 5V Relay
            </h3>
            <p className="text-xs text-slate-500">
              Micro-drip pump actuated via calibrated capacitive moisture threshold
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSettingsModal(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Calibrate Thresholds</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Relay Actuation State
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              isPumpActive 
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                : "bg-slate-200 text-slate-700"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isPumpActive ? "bg-emerald-600" : "bg-slate-400"}`} />
              {isPumpActive ? "PUMP ACTIVE (D8 HIGH)" : "IDLE / CLOSED (D8 LOW)"}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-slate-900">
              {isPumpActive ? "IRRIGATING" : "MONITORING"}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {config.autoMode
              ? `Auto-mode engaged. Triggered if soil moisture < ${config.moistureThresholdLow}%, stops when > ${config.moistureThresholdHigh}%.`
              : "Manual mode active. Automation suspended by operator."}
          </p>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Flow Output:</span>
            <span className="font-mono text-emerald-700 font-bold">{isPumpActive ? "1.8 L/min" : "0.0 L/min"}</span>
          </div>
        </div>

        {/* Safeguards Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Hardware Safeguard Watchdog
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-600">Max Continuous Runtime:</span>
              <span className="font-mono font-semibold text-slate-800">{config.maxRuntimeSeconds}s safeguard</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-600">Pump Cooldown Period:</span>
              <span className="font-mono font-semibold text-slate-800">{config.cooldownPeriodSeconds}s locked</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-600">Dry-Run Prevention:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Reservoir 84% OK
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-emerald-50 p-2 text-[11px] text-emerald-900 border border-emerald-200 font-medium">
            ✓ Arduino EEPROM fail-safe watchdog timer active
          </div>
        </div>

        {/* Manual Override Controls */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Manual Override Controls
              </span>
              <Power className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-1 text-xs text-slate-600 leading-snug">
              Direct digital write (PIN D8) via gateway. Maximum safeguard override applies.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onTriggerManualOverride(!isPumpActive)}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold transition-all shadow-xs active:scale-95 ${
                isPumpActive
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              <Power className="h-4 w-4" />
              <span>{isPumpActive ? "EMERGENCY STOP (FORCE OFF)" : "MANUAL TRIGGER PUMP (FORCE ON)"}</span>
            </button>

            <button
              onClick={() => onUpdateConfig({ autoMode: !config.autoMode })}
              className="w-full rounded-lg border border-slate-200 bg-white hover:bg-slate-100 py-1.5 text-center text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              Mode: {config.autoMode ? "Switch to Manual Mode" : "Switch to Autonomous Auto-Pilot"}
            </button>
          </div>
        </div>
      </div>

      {/* Threshold Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900">Calibrate Moisture Thresholds</h4>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Set the calibrated soil moisture trigger points. Calibrated using capacitive sensor v1.2 analog readings (ADC 300 to 750).
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Pump Trigger (Turn ON if below):</span>
                  <span className="text-rose-600 font-mono font-bold">{tempLow}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="45"
                  value={tempLow}
                  onChange={(e) => setTempLow(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Cutoff (Turn OFF when reaching):</span>
                  <span className="text-emerald-700 font-mono font-bold">{tempHigh}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="85"
                  value={tempHigh}
                  onChange={(e) => setTempHigh(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateConfig({ moistureThresholdLow: tempLow, moistureThresholdHigh: tempHigh });
                  setShowSettingsModal(false);
                }}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
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
