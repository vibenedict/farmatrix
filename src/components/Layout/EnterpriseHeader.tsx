"use client";

import React, { useState } from "react";
import { 
  Sprout, 
  Cpu, 
  ShieldCheck, 
  ExternalLink, 
  ChevronDown,
  Plus
} from "lucide-react";
import { FarmLocation } from "@/lib/types";
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand & Farm Selector */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-sm text-white">
              <Sprout className="h-5 w-5" />
              <div className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-lg text-slate-900 font-mono">FARMATRIX</span>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Smart Agriculture & NEAR Blockchain</p>
            </div>
          </div>

          <div className="hidden lg:block h-6 w-px bg-slate-200" />

          {/* Facility / Farm Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowFarmDropdown(!showFarmDropdown)}
              className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors shadow-2xs"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
              <span className="truncate max-w-[210px]">{selectedFarm.name}</span>
              <span className="text-[10px] text-slate-500 font-mono">({selectedFarm.code})</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showFarmDropdown && (
              <div className="absolute left-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                        ? "bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-600" />
                    <div>
                      <div className="font-semibold text-slate-900">{f.name}</div>
                      <div className="text-[11px] text-slate-500">{f.region} • {f.cropType.split(" (")[0]}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: NEAR Blockchain Status Badge */}
        <div className="hidden xl:flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <span className="font-mono text-slate-700 font-semibold text-[11px]">NEAR Testnet</span>
          </div>
          <span className="text-slate-300">|</span>
          <a
            href={`${NEAR_CONFIG.explorerUrl}/accounts/${NEAR_CONFIG.contractId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-[11px] text-emerald-700 hover:underline font-semibold"
          >
            {NEAR_CONFIG.contractId}
            <ExternalLink className="h-3 w-3" />
          </a>
          <span className="text-slate-300">|</span>
          <span className="text-[10px] text-slate-500 font-mono">Block #118,492,024</span>
        </div>

        {/* Right: Actions, Hardware Status, Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Hardware Connection Indicator */}
          <button
            onClick={onOpenSimulator}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition-colors shadow-2xs ${
              isHardwareConnected
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
            title="Arduino Uno Telemetry Controller"
          >
            <Cpu className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">
              {isHardwareConnected ? "Arduino UNO: Connected" : "Hardware Bench / Bridge"}
            </span>
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span className="hidden md:inline">Role: {roles.find(r => r.id === activeRole)?.label.split(" ")[0]}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                        ? "bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-semibold text-slate-900">{r.label}</span>
                    <span className="text-[11px] text-slate-500">{r.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mint New Batch Button */}
          <button
            onClick={onOpenNewBatchModal}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Register Batch</span>
          </button>
        </div>
      </div>
    </header>
  );
}
