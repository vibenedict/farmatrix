"use client";

import React from "react";
import { ScreenId } from "@/components/Layout/FarmChainHeader";
import { ArrowRight, QrCode, ShieldCheck } from "lucide-react";

interface LandingViewProps {
  onNavigate: (screen: ScreenId) => void;
  soilMoisture?: number;
  isPumpRunning?: boolean;
}

export function LandingView({
  onNavigate,
  soilMoisture = 34,
  isPumpRunning = true,
}: LandingViewProps) {
  return (
    <section id="screen-landing" className="screen-view relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        
        {/* Cropwise-Style Hero Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-enterprise-accent/30 text-enterprise-mint text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-enterprise-accent pulse-dot" />
              Powered by Arduino IoT & NEAR Protocol Blockchain
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              DIGITAL FARMING <br />
              <span className="bg-gradient-to-r from-enterprise-accent via-emerald-300 to-teal-100 bg-clip-text text-transparent">
                CONNECTED & TRACEABLE
              </span>
            </h1>

            <p className="text-base sm:text-lg text-enterprise-textSecondary font-normal max-w-2xl leading-relaxed">
              FARMATRIX FarmChain bridges physical agricultural operations with Web3 provenance. Real-time soil telemetry, automated 5V relay irrigation controls, and tamper-proof product verification.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate("dashboard")}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-enterprise-accent to-emerald-600 text-enterprise-void font-extrabold text-sm shadow-glow-emerald hover:opacity-95 transition-all flex items-center gap-3 group cursor-pointer"
              >
                <span>ENTER EXECUTIVE DASHBOARD</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate("consumer")}
                className="px-8 py-4 rounded-2xl glass-panel glass-panel-hover text-white font-bold text-sm transition-all flex items-center gap-3 cursor-pointer"
              >
                <QrCode className="w-5 h-5 text-enterprise-accent" />
                <span>VERIFY PRODUCT VIA QR</span>
              </button>
            </div>
          </div>

          {/* Hero Feature Live Card Preview */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-enterprise-accent/30 relative">
              <div className="h-48 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                  alt="Thriving agricultural field"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-enterprise-void via-enterprise-void/40 to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-enterprise-void/80 text-enterprise-accent border border-enterprise-accent/40 backdrop-blur-md">
                    LIVE FIELD NODE #04
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                    SALINAS VALLEY
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6 -mt-6 relative z-10">
                <div className="flex items-center justify-between border-b border-enterprise-glassBorder pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-enterprise-accent pulse-dot" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        ORGANIC HASS AVOCADO FLEET
                      </h4>
                      <p className="text-[10px] text-enterprise-textSecondary font-mono">
                        Arduino UNO R3 • Capacitive Probe V1.2
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-enterprise-accent/10 text-enterprise-accent border border-enterprise-accent/30">
                    TELEMETRY
                  </span>
                </div>

                {/* Telemetry Gauges */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel p-4 rounded-2xl bg-enterprise-void/60">
                    <p className="text-[11px] font-semibold text-enterprise-textSecondary uppercase">
                      Soil Moisture Level
                    </p>
                    <p className="text-3xl font-extrabold text-white mt-1">
                      {soilMoisture}%
                    </p>
                    <div className="w-full bg-enterprise-surface h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, soilMoisture))}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-amber-400 mt-2 font-mono">
                      Trigger Cutoff: 45%
                    </p>
                  </div>

                  <div className="glass-panel p-4 rounded-2xl bg-enterprise-void/60">
                    <p className="text-[11px] font-semibold text-enterprise-textSecondary uppercase">
                      Water Pump Actuator
                    </p>
                    <p className={`text-2xl font-extrabold mt-1 ${isPumpRunning ? "text-enterprise-accent" : "text-slate-400"}`}>
                      {isPumpRunning ? "AUTO RUN" : "STANDBY"}
                    </p>
                    <div className="w-full bg-enterprise-surface h-1.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isPumpRunning ? "bg-enterprise-accent pulse-dot" : "bg-slate-600"}`}
                        style={{ width: isPumpRunning ? "100%" : "20%" }}
                      />
                    </div>
                    <p className="text-[10px] text-emerald-400 mt-2 font-mono">
                      {isPumpRunning ? "Relay Pin D7 Closed" : "Relay Pin D7 Open"}
                    </p>
                  </div>
                </div>

                {/* NEAR Blockchain Token Hash Preview */}
                <div className="p-4 rounded-2xl bg-enterprise-near/10 border border-enterprise-near/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-enterprise-near/20 text-indigo-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">NEAR Batch Provenance Minted</p>
                      <p className="text-[10px] text-indigo-300 font-mono">Tx: 0x9f3k...89a1 • Mainnet</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-indigo-300" />
                    Verified
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modular Agricultural Solution Cards */}
        <div className="space-y-6">
          <div className="border-b border-enterprise-glassBorder pb-4">
            <h2 className="text-2xl font-black text-white tracking-tight">Enterprise AgriTech Modules</h2>
            <p className="text-xs text-enterprise-textSecondary mt-1">
              Integrated agronomic solutions connecting hardware sensors to decentralized ledger verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Module 1: Precision Telemetry */}
            <div
              onClick={() => onNavigate("dashboard")}
              className="glass-panel glass-panel-hover p-6 rounded-3xl cursor-pointer space-y-4 border border-enterprise-glassBorder group"
            >
              <div className="h-40 rounded-2xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80"
                  alt="Precision Irrigation"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-enterprise-void via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-enterprise-void/80 text-enterprise-accent font-mono border border-enterprise-accent/30">
                  IOT TELEMETRY
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-enterprise-accent transition-colors">
                Smart Environmental Sensing
              </h3>
              <p className="text-xs text-enterprise-textSecondary leading-relaxed">
                Continuous reading of soil moisture via capacitive probes and ambient temperature/humidity through DHT22 nodes.
              </p>
            </div>

            {/* Module 2: Automated Irrigation */}
            <div
              onClick={() => onNavigate("irrigation")}
              className="glass-panel glass-panel-hover p-6 rounded-3xl cursor-pointer space-y-4 border border-enterprise-glassBorder group"
            >
              <div className="h-40 rounded-2xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=600&q=80"
                  alt="Water Actuation"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-enterprise-void via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-enterprise-void/80 text-amber-400 font-mono border border-amber-400/30">
                  ACTUATOR RELAY
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-enterprise-accent transition-colors">
                Automated Water Actuation
              </h3>
              <p className="text-xs text-enterprise-textSecondary leading-relaxed">
                Threshold-triggered 5V DC relay pumps prevent crop moisture stress while reducing water consumption by 35%.
              </p>
            </div>

            {/* Module 3: NEAR Traceability */}
            <div
              onClick={() => onNavigate("traceability")}
              className="glass-panel glass-panel-hover p-6 rounded-3xl cursor-pointer space-y-4 border border-enterprise-glassBorder group"
            >
              <div className="h-40 rounded-2xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80"
                  alt="Traceability"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-enterprise-void via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-enterprise-void/80 text-indigo-300 font-mono border border-indigo-300/30">
                  NEAR BLOCKCHAIN
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-enterprise-accent transition-colors">
                NEAR Product Traceability
              </h3>
              <p className="text-xs text-enterprise-textSecondary leading-relaxed">
                Cryptographically sign harvest batches and sensor telemetry onto NEAR Protocol for complete consumer provenance.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
