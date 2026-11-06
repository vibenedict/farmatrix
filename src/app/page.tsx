"use client";

import React, { useState, useEffect } from "react";
import { 
  FarmLocation, 
  ProductBatch, 
  SensorReading, 
  IrrigationConfig 
} from "@/lib/types";
import { MOCK_FARMS, INITIAL_BATCHES } from "@/lib/mockData";
import { EnterpriseHeader } from "@/components/Layout/EnterpriseHeader";
import { EnterpriseSidebar } from "@/components/Layout/EnterpriseSidebar";
import { LiveGauge } from "@/components/Telemetry/LiveGauge";
import { TelemetryChart } from "@/components/Telemetry/TelemetryChart";
import { IrrigationControlPanel } from "@/components/Telemetry/IrrigationControlPanel";
import { HardwareSimulatorModal } from "@/components/Telemetry/HardwareSimulatorModal";
import { BatchRegisterModal } from "@/components/Batches/BatchRegisterModal";
import { BatchList } from "@/components/Batches/BatchList";
import { SupplyChainTimeline } from "@/components/SupplyChain/SupplyChainTimeline";
import { RecordEventModal } from "@/components/SupplyChain/RecordEventModal";
import { QRCodeModal } from "@/components/Verification/QRCodeModal";
import { VerificationPortal } from "@/components/Verification/VerificationPortal";
import { PwCAgriInsights } from "@/components/AIInsights/PwCAgriInsights";
import { HardwareGatewayModal } from "@/components/Developer/HardwareGatewayModal";
import { 
  Activity, 
  Cpu, 
  Droplets, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  MapPin, 
  User, 
  Calendar,
  Layers,
  Terminal,
  Zap
} from "lucide-react";

export default function EnterpriseDashboard() {
  const [farms] = useState<FarmLocation[]>(MOCK_FARMS);
  const [selectedFarm, setSelectedFarm] = useState<FarmLocation>(MOCK_FARMS[0]);
  const [activeTab, setActiveTab] = useState<string>("telemetry");
  const [activeRole, setActiveRole] = useState<string>("agronomist");

  // Telemetry state
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [latestReading, setLatestReading] = useState<SensorReading | null>(null);

  // Batches state
  const [batches, setBatches] = useState<ProductBatch[]>(INITIAL_BATCHES);
  const [selectedBatchForTimeline, setSelectedBatchForTimeline] = useState<ProductBatch>(INITIAL_BATCHES[0]);

  // Irrigation config
  const [irrigationConfig, setIrrigationConfig] = useState<IrrigationConfig>({
    autoMode: true,
    moistureThresholdLow: 32,
    moistureThresholdHigh: 68,
    maxRuntimeSeconds: 180,
    cooldownPeriodSeconds: 300,
    lastRunTimestamp: null,
    runtimeElapsedSeconds: 0,
    isSafeguardTriggered: false,
    manualOverride: false,
  });

  // Modals state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrBatch, setQrBatch] = useState<ProductBatch | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [isHardwareConnected, setIsHardwareConnected] = useState(false);

  // Fetch initial telemetry
  useEffect(() => {
    fetch(`/api/telemetry?farmId=${selectedFarm.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReadings(data.history || []);
          setLatestReading(data.latest || null);
        }
      })
      .catch(console.error);
  }, [selectedFarm.id]);

  // Real-time telemetry emulation / live cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setReadings((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];

        // Moisture physics: slowly decreases naturally (evaporation), or rises rapidly if pump is ON
        const isPumpRunning =
          last.pumpStatus === "ON" ||
          last.pumpStatus === "AUTO_IRRIGATING" ||
          (irrigationConfig.autoMode && last.soilMoisture < irrigationConfig.moistureThresholdLow);

        let newMoisture = last.soilMoisture;
        if (isPumpRunning) {
          newMoisture = Math.min(85, newMoisture + 1.2);
        } else {
          newMoisture = Math.max(18, newMoisture - 0.15);
        }
        newMoisture = Number(newMoisture.toFixed(1));

        // Evaluate auto cutoff
        let pumpStatus = last.pumpStatus;
        if (irrigationConfig.autoMode) {
          if (newMoisture < irrigationConfig.moistureThresholdLow) {
            pumpStatus = "AUTO_IRRIGATING";
          } else if (newMoisture >= irrigationConfig.moistureThresholdHigh) {
            pumpStatus = "OFF";
          }
        }

        const newTemp = Number((last.temperature + (Math.random() * 0.2 - 0.1)).toFixed(1));
        const newHum = Math.round(Math.min(95, Math.max(30, last.humidity + (Math.random() * 0.6 - 0.3))));
        const rawSoil = Math.round(750 - (newMoisture / 100) * 450);

        const newReading: SensorReading = {
          id: `live-${Date.now()}`,
          farmId: selectedFarm.id,
          soilMoisture: newMoisture,
          soilMoistureRaw: rawSoil,
          temperature: newTemp,
          humidity: newHum,
          lightIntensity: last.lightIntensity,
          vaporPressureDeficit: last.vaporPressureDeficit,
          pumpStatus,
          waterLevelPct: Number((last.waterLevelPct - (isPumpRunning ? 0.08 : 0.01)).toFixed(1)),
          recordedAt: new Date().toISOString(),
          source: isHardwareConnected ? "HARDWARE_SERIAL" : "WEB_SIMULATOR",
        };

        setLatestReading(newReading);
        return [...prev.slice(1), newReading];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedFarm.id, irrigationConfig, isHardwareConnected]);

  // Simulator apply callback
  const handleSimulateValues = (values: { moisture?: number; temp?: number; humidity?: number; pump?: boolean }) => {
    if (!latestReading) return;
    const updatedMoisture = values.moisture !== undefined ? values.moisture : latestReading.soilMoisture;
    const updatedTemp = values.temp !== undefined ? values.temp : latestReading.temperature;
    const updatedHum = values.humidity !== undefined ? values.humidity : latestReading.humidity;
    const updatedPump = values.pump !== undefined ? (values.pump ? "ON" : "OFF") : latestReading.pumpStatus;

    const newReading: SensorReading = {
      ...latestReading,
      id: `sim-${Date.now()}`,
      soilMoisture: updatedMoisture,
      soilMoistureRaw: Math.round(750 - (updatedMoisture / 100) * 450),
      temperature: updatedTemp,
      humidity: updatedHum,
      pumpStatus: updatedPump,
      recordedAt: new Date().toISOString(),
    };

    setLatestReading(newReading);
    setReadings((prev) => [...prev.slice(1), newReading]);
  };

  const handleTriggerManualOverride = (forceOn: boolean) => {
    if (!latestReading) return;
    setIrrigationConfig((prev) => ({
      ...prev,
      autoMode: false,
      manualOverride: forceOn,
      runtimeElapsedSeconds: forceOn ? 1 : 0,
    }));

    const newReading: SensorReading = {
      ...latestReading,
      pumpStatus: forceOn ? "ON" : "OFF",
      recordedAt: new Date().toISOString(),
    };
    setLatestReading(newReading);
  };

  const handleBatchCreated = (newBatch: ProductBatch) => {
    setBatches((prev) => [newBatch, ...prev]);
    setSelectedBatchForTimeline(newBatch);
  };

  const handleOpenQR = (batch: ProductBatch) => {
    setQrBatch(batch);
    setIsQRModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      {/* Enterprise Executive Header */}
      <EnterpriseHeader
        farms={farms}
        selectedFarm={selectedFarm}
        onSelectFarm={setSelectedFarm}
        activeRole={activeRole}
        onChangeRole={setActiveRole}
        onOpenNewBatchModal={() => setIsBatchModalOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenGatewayModal={() => setIsGatewayModalOpen(true)}
        isHardwareConnected={isHardwareConnected}
        activeTab={activeTab}
      />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Enterprise Sidebar */}
        <EnterpriseSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedFarm={selectedFarm}
          latestReading={latestReading}
          onOpenGatewayModal={() => setIsGatewayModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl">
          
          {/* TAB 1: IOT TELEMETRY & IRRIGATION ENGINE */}
          {activeTab === "telemetry" && (
            <div className="space-y-6 animate-fade-in">
              {/* Facility Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Droplets className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{selectedFarm.name}</span>
                      <span className="font-mono text-xs text-slate-400">({selectedFarm.code})</span>
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {selectedFarm.region}, {selectedFarm.country}
                      </span>
                      <span>•</span>
                      <span>Crop: <strong className="text-emerald-400 font-semibold">{selectedFarm.cropType.split(" (")[0]}</strong></span>
                      <span>•</span>
                      <span>{selectedFarm.totalAreaHectares} Hectares</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => setIsSimulatorOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-colors"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Hardware Simulator Bench</span>
                  </button>
                </div>
              </div>

              {/* 4 Precision Metric Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <LiveGauge
                  title="Soil Moisture"
                  value={latestReading ? latestReading.soilMoisture : 42.5}
                  unit="%"
                  subValue={latestReading ? `Analog ADC: ${latestReading.soilMoistureRaw}` : "ADC: 540"}
                  min={0}
                  max={100}
                  targetRange={[32, 68]}
                  type="moisture"
                  statusText={
                    latestReading && latestReading.soilMoisture < 32
                      ? "Under-irrigated (Threshold Triggered)"
                      : "Optimal Moisture Profile"
                  }
                />

                <LiveGauge
                  title="Ambient Temperature"
                  value={latestReading ? latestReading.temperature : 25.4}
                  unit="°C"
                  subValue="DHT22 Sensor (Pin D2)"
                  min={10}
                  max={45}
                  targetRange={[20, 32]}
                  type="temp"
                />

                <LiveGauge
                  title="Relative Humidity"
                  value={latestReading ? latestReading.humidity : 58}
                  unit="%"
                  subValue={latestReading ? `VPD: ${latestReading.vaporPressureDeficit} kPa` : "VPD: 1.15 kPa"}
                  min={0}
                  max={100}
                  targetRange={[45, 80]}
                  type="humidity"
                />

                <LiveGauge
                  title="Water Reservoir Level"
                  value={latestReading ? latestReading.waterLevelPct : 84.0}
                  unit="%"
                  subValue="Safe Run: 48h Capacity"
                  min={0}
                  max={100}
                  targetRange={[20, 100]}
                  type="water"
                />
              </div>

              {/* Telemetry Chart */}
              <TelemetryChart
                readings={readings}
                lowThreshold={irrigationConfig.moistureThresholdLow}
                highThreshold={irrigationConfig.moistureThresholdHigh}
              />

              {/* Irrigation Control & Safety Safeguards */}
              <IrrigationControlPanel
                config={irrigationConfig}
                onUpdateConfig={(updates) => setIrrigationConfig((prev) => ({ ...prev, ...updates }))}
                onTriggerManualOverride={handleTriggerManualOverride}
                currentMoisture={latestReading ? latestReading.soilMoisture : 42}
              />
            </div>
          )}

          {/* TAB 2: HARVEST BATCH REGISTRY */}
          {activeTab === "batches" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">
                    Certified Harvest Batches & On-Chain Registries
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Immutable batch units committed to NEAR Blockchain with SHA-256 cryptographic proof
                  </p>
                </div>
              </div>

              <BatchList
                batches={batches}
                onOpenQR={handleOpenQR}
                onSelectBatchForTimeline={(b) => {
                  setSelectedBatchForTimeline(b);
                  setActiveTab("supplychain");
                }}
                onOpenNewBatchModal={() => setIsBatchModalOpen(true)}
              />
            </div>
          )}

          {/* TAB 3: PROVENANCE TRACK & TRACE */}
          {activeTab === "supplychain" && (
            <div className="space-y-6 animate-fade-in">
              <SupplyChainTimeline
                batch={selectedBatchForTimeline}
                onOpenRecordModal={() => setIsRecordModalOpen(true)}
                onOpenQR={() => handleOpenQR(selectedBatchForTimeline)}
              />
            </div>
          )}

          {/* TAB 4: PWC AGRIBUSINESS & ESG INTELLIGENCE */}
          {activeTab === "pwc-insights" && (
            <div className="animate-fade-in">
              <PwCAgriInsights selectedFarm={selectedFarm} />
            </div>
          )}

          {/* TAB 5: CONSUMER VERIFICATION PORTAL */}
          {activeTab === "consumer-verify" && (
            <div className="animate-fade-in">
              <VerificationPortal
                initialBatch={selectedBatchForTimeline}
                allBatches={batches}
              />
            </div>
          )}

          {/* TAB 6: DEVELOPER HUB */}
          {activeTab === "hardware-gateway" && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-6 space-y-4 animate-fade-in text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Terminal className="h-8 w-8" />
              </div>
              <h2 className="text-lg font-bold text-white">Developer Hub & Open Architecture</h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Access full source code for Arduino UNO firmware, Node.js USB serial gateway, NEAR Rust smart contract, and Supabase PostgreSQL schema.
              </p>
              <button
                onClick={() => setIsGatewayModalOpen(true)}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all"
              >
                Launch Developer Hub Modal
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <HardwareSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        currentMoisture={latestReading ? latestReading.soilMoisture : 42}
        currentTemp={latestReading ? latestReading.temperature : 25}
        currentHumidity={latestReading ? latestReading.humidity : 60}
        isPumpActive={latestReading?.pumpStatus === "ON" || latestReading?.pumpStatus === "AUTO_IRRIGATING"}
        onSimulateValues={handleSimulateValues}
      />

      <BatchRegisterModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        farms={farms}
        selectedFarm={selectedFarm}
        onBatchCreated={handleBatchCreated}
      />

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        batch={qrBatch}
      />

      <RecordEventModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        batch={selectedBatchForTimeline}
        onEventAdded={(evt) => {
          setSelectedBatchForTimeline((prev) => ({
            ...prev,
            events: [...prev.events, evt],
          }));
        }}
      />

      <HardwareGatewayModal
        isOpen={isGatewayModalOpen}
        onClose={() => setIsGatewayModalOpen(false)}
      />
    </div>
  );
}
