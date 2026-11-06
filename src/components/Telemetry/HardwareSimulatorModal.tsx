"use client";

import React, { useState } from "react";
import { 
  Cpu, 
  Terminal, 
  Play, 
  RotateCcw, 
  Sliders, 
  Droplets, 
  CloudRain, 
  Sun, 
  Zap, 
  Usb, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { WebSerialManager } from "@/lib/webSerial";

interface HardwareSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMoisture: number;
  currentTemp: number;
  currentHumidity: number;
  isPumpActive: boolean;
  onSimulateValues: (values: { moisture?: number; temp?: number; humidity?: number; pump?: boolean }) => void;
}

export function HardwareSimulatorModal({
  isOpen,
  onClose,
  currentMoisture,
  currentTemp,
  currentHumidity,
  isPumpActive,
  onSimulateValues,
}: HardwareSimulatorModalProps) {
  const [sliderMoisture, setSliderMoisture] = useState(currentMoisture);
  const [sliderTemp, setSliderTemp] = useState(currentTemp);
  const [sliderHum, setSliderHum] = useState(currentHumidity);
  const [serialLogs, setSerialLogs] = useState<string[]>([
    "[SYSTEM] Serial port initialized at 9600 baud.",
    "[GATEWAY] Connected to Arduino UNO R3 (ATmega328P).",
    `[SERIAL] {"soil_pct": ${currentMoisture.toFixed(1)}, "raw_adc": 580, "temp": ${currentTemp.toFixed(1)}, "humidity": ${currentHumidity}, "relay": ${isPumpActive ? 1 : 0}, "safeguard": 0}`,
  ]);
  const [isWebSerialConnected, setIsWebSerialConnected] = useState(false);
  const [webSerialError, setWebSerialError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplySliders = () => {
    onSimulateValues({
      moisture: sliderMoisture,
      temp: sliderTemp,
      humidity: sliderHum,
    });
    setSerialLogs((prev) => [
      `[SERIAL] {"soil_pct": ${sliderMoisture.toFixed(1)}, "raw_adc": ${Math.round(750 - (sliderMoisture / 100) * 450)}, "temp": ${sliderTemp.toFixed(1)}, "humidity": ${sliderHum}, "relay": ${sliderMoisture < 32 ? 1 : 0}, "safeguard": 0}`,
      ...prev.slice(0, 8),
    ]);
  };

  const handleTriggerDrought = () => {
    setSliderMoisture(26.5);
    onSimulateValues({ moisture: 26.5, pump: true });
    setSerialLogs((prev) => [
      "[ALERT] Moisture below 32.0% threshold. Arduino Digital Pin D8 -> HIGH.",
      '[SERIAL] {"soil_pct": 26.5, "raw_adc": 640, "temp": 28.5, "humidity": 45, "relay": 1, "safeguard": 0}',
      ...prev.slice(0, 8),
    ]);
  };

  const handleTriggerRain = () => {
    setSliderMoisture(82.0);
    onSimulateValues({ moisture: 82.0, pump: false });
    setSerialLogs((prev) => [
      "[INFO] Moisture exceeded 68.0% cutoff. Arduino Digital Pin D8 -> LOW.",
      '[SERIAL] {"soil_pct": 82.0, "raw_adc": 310, "temp": 21.0, "humidity": 88, "relay": 0, "safeguard": 0}',
      ...prev.slice(0, 8),
    ]);
  };

  const handleConnectWebSerial = async () => {
    setWebSerialError(null);
    const serial = new WebSerialManager();
    if (!serial.isSupported()) {
      setWebSerialError("Web Serial API is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    try {
      const ok = await serial.connect(
        (packet) => {
          setIsWebSerialConnected(true);
          onSimulateValues({
            moisture: packet.soil_pct,
            temp: packet.temp,
            humidity: packet.humidity,
            pump: packet.pump_status === "ON",
          });
          setSerialLogs((prev) => [
            `[USB LIVE] ${JSON.stringify(packet)}`,
            ...prev.slice(0, 8),
          ]);
        },
        (err) => {
          setWebSerialError(err.message);
        }
      );
      if (ok) setIsWebSerialConnected(true);
    } catch (err: any) {
      setWebSerialError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Hardware Bench & Arduino UNO R3 Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Interactive IoT sensor emulation & live Web Serial USB connector
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Quick Scenario Triggers */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Quick Scenario Testing (Hackathon Demo)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
              onClick={handleTriggerDrought}
              className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-left hover:bg-rose-500/20 transition-colors"
            >
              <Sun className="h-4 w-4 text-rose-400" />
              <div>
                <div className="text-xs font-bold text-rose-200">Trigger Dry Soil</div>
                <div className="text-[10px] text-rose-400">Moisture &lt;30% (Pump ON)</div>
              </div>
            </button>

            <button
              onClick={handleTriggerRain}
              className="flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 text-left hover:bg-sky-500/20 transition-colors"
            >
              <CloudRain className="h-4 w-4 text-sky-400" />
              <div>
                <div className="text-xs font-bold text-sky-200">Trigger Rain Event</div>
                <div className="text-[10px] text-sky-400">Moisture 82% (Pump OFF)</div>
              </div>
            </button>

            <button
              onClick={handleConnectWebSerial}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-left hover:bg-emerald-500/20 transition-colors col-span-2 sm:col-span-1"
            >
              <Usb className="h-4 w-4 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-emerald-200">Connect Real USB</div>
                <div className="text-[10px] text-emerald-400">Web Serial API (Chrome)</div>
              </div>
            </button>
          </div>

          {webSerialError && (
            <div className="rounded-lg bg-amber-500/10 p-2 text-xs text-amber-300 border border-amber-500/20 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{webSerialError}</span>
            </div>
          )}
        </div>

        {/* Sliders */}
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Continuous Parameter Adjustment</span>
            <button
              onClick={handleApplySliders}
              className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              Push to Telemetry
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-400">Soil Moisture:</span>
                <span className="font-mono text-emerald-400 font-bold">{sliderMoisture}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={sliderMoisture}
                onChange={(e) => setSliderMoisture(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-400">Ambient Temperature:</span>
                <span className="font-mono text-sky-400 font-bold">{sliderTemp}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="45"
                value={sliderTemp}
                onChange={(e) => setSliderTemp(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-400">Relative Humidity:</span>
                <span className="font-mono text-cyan-400 font-bold">{sliderHum}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                value={sliderHum}
                onChange={(e) => setSliderHum(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Serial Terminal Output */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-slate-400" />
              Live USB Serial Stream (9600 Baud)
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">RX: OK • CRC: Valid</span>
          </div>
          <div className="h-28 overflow-y-auto rounded-xl border border-white/10 bg-black/80 p-3 font-mono text-[11px] text-slate-300 space-y-1">
            {serialLogs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.includes("ALERT")
                    ? "text-rose-400"
                    : log.includes("INFO")
                    ? "text-sky-300"
                    : log.includes("USB LIVE")
                    ? "text-emerald-400 font-bold"
                    : "text-slate-400"
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
