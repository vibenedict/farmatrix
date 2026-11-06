"use client";

import React, { useState } from "react";
import { 
  Sprout, 
  Cpu, 
  ShieldCheck, 
  Link2, 
  Bell, 
  Plus, 
  ExternalLink, 
  Activity, 
  CheckCircle2, 
  ChevronDown,
  Layers,
  Sparkles
} from "lucide-react";
import { FarmLocation, NearNetworkStatus } from "@/lib/types";
import { NEAR_CONFIG } from "@/lib/nearClient";

interface EnterpriseHeaderProps {
  farms: FarmLocation[];
  selectedFarm: FarmLocation;
  onSelectFarm: (farm: FarmLocation) => void;
  activeRole: string;
  onChangeRole: (role: string) => void;
  onOpenNewBatchModal: () => void;
  onOpenSimulator: () => void;
  onOpenGatewayModal: () => void;
  isHardwareConnected: boolean;
  activeTab: string;
}

export function EnterpriseHeader({
  farms,
  selectedFarm,
  onSelectFarm,
  activeRole,
  onChangeRole,
  onOpenNewBatchModal,
  onOpenSimulator,
  onOpenGatewayModal,
  isHardwareConnected,
}: EnterpriseHeaderProps) {
  const [showFarmDropdown, setShowFarmDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles = [
    { id: "agronomist", label: "Master Agronomist & IoT Lead", desc: "Sensors & Irrigation Engine" },
    { id: "supplychain", label: "Global Logistics Director", desc: "Cold Chain & Track-Trace" },
    { id: "auditor", label: "PwC ESG & Quality Auditor", desc: "Compliance & Carbon Records" },
    { id: "consumer", label: "Public Consumer Transparency", desc: "QR Scan & Cryptographic Proof" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090d16]/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand & Farm Selector */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
              <Sprout className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-400">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-950 animate-ping" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-lg text-white font-mono">FARMATRIX</span>
                <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Smart Agriculture & NEAR Blockchain</p>
            </div>
          </div>

          <div className="hidden lg:block h-6 w-px bg-white/10" />

          {/* Facility / Farm Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowFarmDropdown(!showFarmDropdown)}
              className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/[0.08] transition-colors"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/30" />
              <span className="truncate max-w-[210px] font-medium">{selectedFarm.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">({selectedFarm.code})</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showFarmDropdown && (
              <div className="absolute left-0 mt-2 w-80 rounded-xl border border-white/15 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl z-50">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Select Production Facility
                </div>
                {farms.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onSelectFarm(f);
                      setShowFarmDropdown(false);
                    }}
                    className={`flex w-full items-start gap-3 rounded-lg p-2.5 text-left text-xs transition-colors ${
                      f.id === selectedFarm.id
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-400" />
                    <div>
                      <div className="font-semibold text-white">{f.name}</div>
                      <div className="text-[11px] text-slate-400">{f.region} • {f.cropType.split(" (")[0]}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: NEAR Blockchain Status Badge */}
        <div className="hidden xl:flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-3.5 py-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ec97] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ec97]"></span>
            </span>
            <span className="font-mono text-slate-300 font-semibold text-[11px]">NEAR Testnet</span>
          </div>
          <span className="text-white/20">|</span>
          <a
            href={`${NEAR_CONFIG.explorerUrl}/accounts/${NEAR_CONFIG.contractId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-[11px] text-[#00ec97] hover:underline"
          >
            {NEAR_CONFIG.contractId}
            <ExternalLink className="h-3 w-3" />
          </a>
          <span className="text-white/20">|</span>
          <span className="text-[10px] text-slate-400 font-mono">Block #118,492,024</span>
        </div>

        {/* Right: Actions, Hardware Status, Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Hardware Connection Indicator */}
          <button
            onClick={onOpenSimulator}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors ${
              isHardwareConnected
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
            }`}
            title="Arduino Uno Telemetry Controller"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {isHardwareConnected ? "Arduino UNO: Serial Live" : "Hardware Bench / Bridge"}
            </span>
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden md:inline font-medium">Role: {roles.find(r => r.id === activeRole)?.label.split(" ")[0]}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-white/15 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl z-50">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Switch Active Perspective
                </div>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onChangeRole(r.id);
                      setShowRoleDropdown(false);
                    }}
                    className={`flex w-full flex-col rounded-lg p-2 text-left text-xs transition-colors ${
                      r.id === activeRole
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <span className="font-semibold text-white">{r.label}</span>
                    <span className="text-[11px] text-slate-400">{r.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mint New Batch Button */}
          <button
            onClick={onOpenNewBatchModal}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Register Batch</span>
          </button>
        </div>
      </div>
    </header>
  );
}
