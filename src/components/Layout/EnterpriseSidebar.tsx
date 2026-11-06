"use client";

import React from "react";
import { 
  Activity, 
  Boxes, 
  GitFork, 
  BarChart3, 
  QrCode, 
  Terminal, 
  ExternalLink,
  Cpu
} from "lucide-react";
import { FarmLocation, SensorReading } from "@/lib/types";

interface EnterpriseSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedFarm: FarmLocation;
  latestReading?: SensorReading | null;
  onOpenGatewayModal: () => void;
}

export function EnterpriseSidebar({
  activeTab,
  onTabChange,
  selectedFarm,
  latestReading,
  onOpenGatewayModal,
}: EnterpriseSidebarProps) {
  const navItems = [
    {
      id: "telemetry",
      label: "IoT Farm Telemetry",
      sublabel: "Sensors & Irrigation Engine",
      icon: Activity,
      badge: latestReading ? `${latestReading.soilMoisture}% Moist` : undefined,
    },
    {
      id: "batches",
      label: "Harvest Batch Registry",
      sublabel: "On-Chain Minting & QR",
      icon: Boxes,
    },
    {
      id: "supplychain",
      label: "Provenance & Track-Trace",
      sublabel: "Cold-Chain Lifecycle",
      icon: GitFork,
    },
    {
      id: "pwc-insights",
      label: "PwC Agribusiness ESG",
      sublabel: "Value-Chain & AI Analytics",
      icon: BarChart3,
      badge: "PwC Aligned",
    },
    {
      id: "consumer-verify",
      label: "Consumer Verification",
      sublabel: "Cryptographic Transparency",
      icon: QrCode,
    },
    {
      id: "hardware-gateway",
      label: "Developer Hub & Code",
      sublabel: "Arduino, Rust, Gateway DDL",
      icon: Terminal,
    },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 flex flex-col justify-between border-r border-slate-200 bg-slate-50/70 p-4">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Enterprise Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-950 font-bold border border-emerald-200 shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-500 group-hover:text-slate-900"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="leading-snug">{item.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{item.sublabel}</div>
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                        isActive
                          ? "bg-emerald-100 text-emerald-800 font-semibold"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Facility Quick Telemetry Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-emerald-600" />
              Active Hardware Node
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="text-[10px] text-slate-500 block">Soil Moisture</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {latestReading ? `${latestReading.soilMoisture}%` : "38.2%"}
              </span>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="text-[10px] text-slate-500 block">Temperature</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {latestReading ? `${latestReading.temperature}°C` : "24.6°C"}
              </span>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="text-[10px] text-slate-500 block">Relay Pump</span>
              <span className={`font-mono font-bold text-xs ${
                latestReading?.pumpStatus === "ON" || latestReading?.pumpStatus === "AUTO_IRRIGATING" 
                  ? "text-emerald-700" 
                  : "text-slate-500"
              }`}>
                {latestReading?.pumpStatus === "AUTO_IRRIGATING" ? "AUTO ON" : (latestReading?.pumpStatus || "OFF")}
              </span>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="text-[10px] text-slate-500 block">Reservoir</span>
              <span className="font-mono font-bold text-emerald-800 text-xs">
                {latestReading ? `${latestReading.waterLevelPct}%` : "84.0%"}
              </span>
            </div>
          </div>

          <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
            <span>Node: Arduino UNO R3</span>
            <span className="font-mono text-[10px] text-emerald-700 font-semibold">USB COM3 (9600)</span>
          </div>
        </div>
      </div>

      {/* Footer Info & Developer Link */}
      <div className="pt-4 space-y-2 border-t border-slate-200">
        <button
          onClick={onOpenGatewayModal}
          className="w-full flex items-center justify-between rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 px-3 py-2 text-xs text-slate-800 font-semibold transition-colors"
        >
          <span className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-emerald-600" />
            Inspect Gateway & Code
          </span>
          <ExternalLink className="h-3 w-3 text-slate-400" />
        </button>

        <div className="px-1 text-[10px] text-slate-400 text-center font-medium">
          NEAR Hackathon Prototype • v1.0 Enterprise
        </div>
      </div>
    </aside>
  );
}
