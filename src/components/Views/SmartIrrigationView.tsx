"use client";

import React, { useState } from "react";
import { Sliders, CheckCircle2, Droplets, Zap } from "lucide-react";

interface SmartIrrigationViewProps {
  cutoffThreshold?: number;
  onUpdateCutoff?: (threshold: number) => void;
}

export function SmartIrrigationView({
  cutoffThreshold = 45,
  onUpdateCutoff,
}: SmartIrrigationViewProps) {
  const [cutoff, setCutoff] = useState(cutoffThreshold);
  const [pulseDuration, setPulseDuration] = useState(15);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (onUpdateCutoff) {
      onUpdateCutoff(cutoff);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <section id="screen-irrigation" className="screen-view relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Bar */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-enterprise-glassBorder">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Precision Irrigation & Actuator Automation
            </h2>
            <p className="text-xs text-enterprise-textSecondary mt-1">
              Configure soil moisture threshold boundaries, relay pulse timers, and manual overrides.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-enterprise-accent/20 text-enterprise-accent text-xs font-mono font-bold border border-enterprise-accent/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-enterprise-accent pulse-dot" />
              MODE: SENSOR-DRIVEN AUTO
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Threshold Adjustment Card */}
          <div className="glass-panel p-6 rounded-3xl space-y-6 border border-enterprise-glassBorder">
            <h3 className="font-bold text-white text-lg border-b border-enterprise-glassBorder pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-enterprise-accent" />
              Automated Trigger Rules
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-enterprise-textSecondary">Moisture Cutoff Threshold</span>
                  <span className="text-enterprise-accent font-mono text-sm">{cutoff}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="70"
                  value={cutoff}
                  onChange={(e) => setCutoff(Number(e.target.value))}
                  className="w-full accent-enterprise-accent bg-enterprise-void h-2 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-enterprise-textSecondary mt-1.5">
                  Pump activates automatically when capacitive probe reads under {cutoff}% moisture.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-enterprise-textSecondary">Irrigation Pulse Duration</span>
                  <span className="text-white font-mono text-sm">{pulseDuration} Minutes</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={pulseDuration}
                  onChange={(e) => setPulseDuration(Number(e.target.value))}
                  className="w-full accent-enterprise-accent bg-enterprise-void h-2 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-enterprise-textSecondary mt-1.5">
                  Relay pin D7 closes for {pulseDuration} minutes per irrigation cycle before cooldown.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-enterprise-void/60 border border-enterprise-glassBorder space-y-2 text-xs font-mono">
                <div className="flex justify-between text-enterprise-textSecondary">
                  <span>Hardware Safeguard:</span>
                  <span className="text-enterprise-mint font-bold">Max 180s Timeout</span>
                </div>
                <div className="flex justify-between text-enterprise-textSecondary">
                  <span>Relay Solenoid:</span>
                  <span className="text-white">Active High (5V Trigger)</span>
                </div>
                <div className="flex justify-between text-enterprise-textSecondary">
                  <span>Audit Trail:</span>
                  <span className="text-indigo-300">Logged to On-Chain ESG</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-enterprise-accent to-emerald-600 text-enterprise-void font-extrabold text-xs shadow-glow-emerald hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-enterprise-void" />
                  <span>RULES UPDATED SUCCESSFULLY!</span>
                </>
              ) : (
                <span>SAVE THRESHOLD RULES</span>
              )}
            </button>
          </div>

          {/* Water Footprint Log Table */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4 border border-enterprise-glassBorder flex flex-col">
            <div className="flex items-center justify-between border-b border-enterprise-glassBorder pb-3">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                Irrigation Water Footprint Log
              </h3>
              <span className="text-xs text-enterprise-mint font-mono font-semibold">
                Water Savings: +35.2% vs Flood
              </span>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-enterprise-void/80 text-enterprise-textSecondary font-bold uppercase border-b border-enterprise-glassBorder">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Trigger Source</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Water Volume</th>
                    <th className="p-3 text-right">Moisture Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-enterprise-glassBorder text-gray-200 font-medium">
                  <tr>
                    <td className="p-3 font-mono text-enterprise-textSecondary">Today, 10:42 AM</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Auto Cutoff (34%)
                      </span>
                    </td>
                    <td className="p-3">15 Minutes</td>
                    <td className="p-3 font-mono text-white">120 Gallons</td>
                    <td className="p-3 text-right font-bold text-enterprise-accent">34% → 58%</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-enterprise-textSecondary">Yesterday, 04:00 PM</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Manual Override
                      </span>
                    </td>
                    <td className="p-3">10 Minutes</td>
                    <td className="p-3 font-mono text-white">80 Gallons</td>
                    <td className="p-3 text-right font-bold text-enterprise-accent">40% → 62%</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-enterprise-textSecondary">Nov 10, 06:15 AM</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Auto Cutoff (31%)
                      </span>
                    </td>
                    <td className="p-3">15 Minutes</td>
                    <td className="p-3 font-mono text-white">125 Gallons</td>
                    <td className="p-3 text-right font-bold text-enterprise-accent">31% → 56%</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-enterprise-textSecondary">Nov 09, 05:30 PM</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Scheduled Cycle
                      </span>
                    </td>
                    <td className="p-3">8 Minutes</td>
                    <td className="p-3 font-mono text-white">65 Gallons</td>
                    <td className="p-3 text-right font-bold text-enterprise-accent">45% → 60%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
