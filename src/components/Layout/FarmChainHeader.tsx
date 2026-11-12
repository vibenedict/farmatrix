"use client";

import React from "react";
import { Cpu, Terminal, Radio } from "lucide-react";

export type ScreenId = "landing" | "dashboard" | "farms" | "irrigation" | "traceability" | "consumer";

interface FarmChainHeaderProps {
  currentScreen: ScreenId;
  onScreenChange: (screen: ScreenId) => void;
  onOpenSimulator: () => void;
  onOpenGateway: () => void;
  isArduinoOnline?: boolean;
}

export function FarmChainHeader({
  currentScreen,
  onScreenChange,
  onOpenSimulator,
  onOpenGateway,
  isArduinoOnline = true,
}: FarmChainHeaderProps) {
  const tabs: Array<{ id: ScreenId; label: string; hasBadge?: boolean }> = [
    { id: "landing", label: "Overview" },
    { id: "dashboard", label: "Dashboard" },
    { id: "farms", label: "Farm Fleet" },
    { id: "irrigation", label: "Smart Irrigation" },
    { id: "traceability", label: "NEAR Batches", hasBadge: true },
    { id: "consumer", label: "QR Verification" },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-enterprise-glassBorder">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => onScreenChange("landing")}
          >
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-enterprise-accent to-emerald-700 flex items-center justify-center text-enterprise-void font-black text-xl shadow-glow-emerald">
              FC
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block leading-none">
                FARMATRIX
              </span>
              <span className="text-[10px] font-bold text-enterprise-mint tracking-widest uppercase mt-1 block">
                Enterprise AgriTech
              </span>
            </div>
          </div>

          {/* Desktop Dynamic Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 glass-panel p-1.5 rounded-2xl border border-enterprise-glassBorder">
            {tabs.map((tab) => {
              const isActive = currentScreen === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onScreenChange(tab.id)}
                  id={`tab-${tab.id}`}
                  className={`screen-tab px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-enterprise-accent text-enterprise-void font-bold shadow-glow-emerald"
                      : "text-enterprise-textSecondary hover:text-white hover:bg-enterprise-surface/50"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.hasBadge && (
                    <span className="w-2 h-2 rounded-full bg-enterprise-near animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* System Connection Pill & Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Live Hardware Gateway launcher */}
            <button
              onClick={onOpenGateway}
              title="Configure USB Serial Port Bridge"
              className="p-2 rounded-xl bg-enterprise-void/80 border border-enterprise-glassBorder text-enterprise-mint hover:text-white hover:border-enterprise-accent transition-colors cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
            </button>

            {/* Hardware Simulator launcher */}
            <button
              onClick={onOpenSimulator}
              title="Launch Edge Node Hardware Simulator"
              className="p-2 rounded-xl bg-enterprise-void/80 border border-enterprise-glassBorder text-enterprise-accent hover:text-white hover:border-enterprise-accent transition-colors cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
            </button>

            {/* Arduino Serial Status */}
            <div className="px-3 py-1.5 rounded-xl bg-enterprise-void/80 border border-enterprise-glassBorder flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isArduinoOnline ? "bg-enterprise-accent pulse-dot" : "bg-enterprise-rust"}`} />
              <span className="text-xs font-mono font-bold text-enterprise-mint">
                {isArduinoOnline ? "Arduino Serial: ONLINE" : "Arduino Serial: STANDBY"}
              </span>
            </div>

            {/* Portal Access Button */}
            <button
              onClick={() => onScreenChange("dashboard")}
              className="px-4 py-2 rounded-xl bg-enterprise-accent hover:bg-enterprise-accentHover text-enterprise-void font-extrabold text-xs shadow-glow-emerald transition-all cursor-pointer"
            >
              Portal Access
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Sub-bar */}
      <div className="lg:hidden px-4 py-2 bg-enterprise-void/90 border-t border-enterprise-glassBorder flex items-center gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onScreenChange(tab.id)}
              className={`mobile-screen-tab px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "text-enterprise-void bg-enterprise-accent font-bold"
                  : "text-enterprise-textSecondary hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
