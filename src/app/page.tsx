"use client";

import React, { useState, useEffect } from "react";
import { NatureParticlesCanvas } from "@/components/NatureParticlesCanvas";
import { FarmChainHeader, ScreenId } from "@/components/Layout/FarmChainHeader";
import { FarmChainFooter } from "@/components/Layout/FarmChainFooter";
import { LandingView } from "@/components/Views/LandingView";
import { DashboardView } from "@/components/Views/DashboardView";
import { FarmFleetView } from "@/components/Views/FarmFleetView";
import { SmartIrrigationView } from "@/components/Views/SmartIrrigationView";
import { TraceabilityView } from "@/components/Views/TraceabilityView";
import { ConsumerVerificationView } from "@/components/Views/ConsumerVerificationView";

// Modals for complete functionality
import { HardwareSimulatorModal } from "@/components/Telemetry/HardwareSimulatorModal";
import { HardwareGatewayModal } from "@/components/Developer/HardwareGatewayModal";
import { PwCAgriInsights } from "@/components/AIInsights/PwCAgriInsights";
import { MOCK_FARMS } from "@/lib/mockData";
import { X, BarChart3 } from "lucide-react";

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("landing");

  // Telemetry & Edge State
  const [moisture, setMoisture] = useState<number>(34);
  const [temperature, setTemperature] = useState<number>(28.4);
  const [humidity, setHumidity] = useState<number>(62);
  const [isPumpRunning, setIsPumpRunning] = useState<boolean>(false);
  const [cutoffThreshold, setCutoffThreshold] = useState<number>(45);

  // Serial Console Logs
  const [serialLogs, setSerialLogs] = useState<string[]>([
    "[08:00:12] BAUD 9600 OK — ARDUINO UNO R3 INITIALIZED",
    "[08:00:15] READ SOIL: 34% (V: 2.1V / CAPACITIVE PROBE V1.2)",
    "[08:00:18] DHT22 SENSOR: TEMP: 28.4C | HUM: 62%",
    "[08:00:20] WARN: SOIL MOISTURE < 45% THRESHOLD CUTOFF",
    "[08:00:22] RELAY PIN D7: TRIGGERED AUTO IRRIGATION CYCLE",
    "[08:15:00] NEAR TX: 0x9f3k...89a1 IMMUTABLE MINT OK",
    "[08:22:45] SYNC: SUPABASE EDGE DB SYNCHRONIZED (LATENCY 18ms)",
  ]);

  // Selected batch for consumer portal
  const [selectedBatchId, setSelectedBatchId] = useState<string>("#FC-AVO-2026-88");

  // Modals
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isGatewayOpen, setIsGatewayOpen] = useState<boolean>(false);
  const [isPwCInsightsOpen, setIsPwCInsightsOpen] = useState<boolean>(false);

  // Screen switching helper
  const handleScreenChange = (screen: ScreenId) => {
    setCurrentScreen(screen);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Toggle Pump override
  const handleTogglePump = () => {
    const nextState = !isPumpRunning;
    setIsPumpRunning(nextState);

    const now = new Date().toTimeString().split(" ")[0];
    const newLog = nextState
      ? `[${now}] OVERRIDE: MANUAL PUMP ACTUATOR ACTIVATED (PIN D7 HIGH)`
      : `[${now}] OVERRIDE: PUMP ACTUATOR STOPPED (PIN D7 LOW)`;

    setSerialLogs((prev) => [newLog, ...prev.slice(0, 40)]);
  };

  // When simulated from HardwareSimulatorModal
  const handleSimulateValues = (values: {
    moisture?: number;
    temp?: number;
    humidity?: number;
    pump?: boolean;
  }) => {
    if (values.moisture !== undefined) setMoisture(values.moisture);
    if (values.temp !== undefined) setTemperature(values.temp);
    if (values.humidity !== undefined) setHumidity(values.humidity);
    if (values.pump !== undefined) setIsPumpRunning(values.pump);

    const now = new Date().toTimeString().split(" ")[0];
    const log = `[${now}] SIMULATOR: Moisture=${values.moisture ?? moisture}% Temp=${values.temp ?? temperature}C Pump=${values.pump ?? isPumpRunning ? "1" : "0"}`;
    setSerialLogs((prev) => [log, ...prev.slice(0, 40)]);
  };

  return (
    <div className="min-h-screen bg-enterprise-void text-[#F8FAFC] flex flex-col relative selection:bg-enterprise-accent selection:text-enterprise-void">
      {/* Background Interactive Luminous Particles */}
      <NatureParticlesCanvas />

      {/* Top Sticky Navigation */}
      <FarmChainHeader
        currentScreen={currentScreen}
        onScreenChange={handleScreenChange}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenGateway={() => setIsGatewayOpen(true)}
        isArduinoOnline={true}
      />

      {/* Main Screen Views */}
      <main className="flex-1">
        {currentScreen === "landing" && (
          <LandingView
            onNavigate={handleScreenChange}
            soilMoisture={moisture}
            isPumpRunning={isPumpRunning}
          />
        )}

        {currentScreen === "dashboard" && (
          <DashboardView
            moisture={moisture}
            temperature={temperature}
            humidity={humidity}
            isPumpRunning={isPumpRunning}
            onTogglePump={handleTogglePump}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onOpenGateway={() => setIsGatewayOpen(true)}
            onOpenPwCInsights={() => setIsPwCInsightsOpen(true)}
            serialLogs={serialLogs}
          />
        )}

        {currentScreen === "farms" && (
          <FarmFleetView onNavigate={handleScreenChange} />
        )}

        {currentScreen === "irrigation" && (
          <SmartIrrigationView
            cutoffThreshold={cutoffThreshold}
            onUpdateCutoff={(val) => {
              setCutoffThreshold(val);
              const now = new Date().toTimeString().split(" ")[0];
              setSerialLogs((prev) => [
                `[${now}] CONFIG: Moisture cutoff threshold updated to ${val}%`,
                ...prev,
              ]);
            }}
          />
        )}

        {currentScreen === "traceability" && (
          <TraceabilityView
            onNavigate={handleScreenChange}
            onSelectBatch={(id) => setSelectedBatchId(id)}
          />
        )}

        {currentScreen === "consumer" && (
          <ConsumerVerificationView batchId={selectedBatchId} />
        )}
      </main>

      {/* Footer */}
      <FarmChainFooter />

      {/* Hardware Simulator Modal */}
      <HardwareSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        currentMoisture={moisture}
        currentTemp={temperature}
        currentHumidity={humidity}
        isPumpActive={isPumpRunning}
        onSimulateValues={handleSimulateValues}
      />

      {/* Hardware Gateway & Circuit Modal */}
      <HardwareGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
      />

      {/* PwC ESG AgriInsights Modal */}
      {isPwCInsightsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-enterprise-accent/30 space-y-6 animate-fade-in relative">
            <div className="flex items-center justify-between border-b border-enterprise-glassBorder pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-enterprise-surface flex items-center justify-center text-enterprise-accent">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">PwC AgriBusiness Insights & ESG Alignment</h3>
                  <p className="text-xs text-enterprise-textSecondary font-mono">Benchmark Metrics 2020-2026</p>
                </div>
              </div>
              <button
                onClick={() => setIsPwCInsightsOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-enterprise-void/70 p-6 rounded-2xl border border-enterprise-glassBorder text-slate-200">
              <PwCAgriInsights selectedFarm={MOCK_FARMS[0]} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
