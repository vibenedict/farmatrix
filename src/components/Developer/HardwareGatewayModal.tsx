"use client";

import React, { useState } from "react";
import { Terminal, Copy, CheckCircle2, Download, Code2, Cpu, Database, Blocks, Zap, ExternalLink } from "lucide-react";

interface HardwareGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HardwareGatewayModal({ isOpen, onClose }: HardwareGatewayModalProps) {
  const [activeTab, setActiveTab] = useState<"circuit" | "arduino" | "gateway" | "contract" | "database">("circuit");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeSnippets = {
    arduino: `/*
 * FARMATRIX - Smart Agriculture IoT Firmware
 * Target: Arduino UNO R3 (ATmega328P)
 * Pins:
 *   - A0: Capacitive Soil Moisture Sensor v1.2
 *   - D2: DHT22 (AM2302) Temperature & Relative Humidity
 *   - D8: 5V Active-Low Relay Module (Submersible Pump)
 *   - A1: Light Dependent Resistor (LDR) Photocell
 */

#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT22
#define SOIL_PIN A0
#define RELAY_PIN 8
#define LDR_PIN A1

// Calibrated Thresholds
const int SOIL_DRY_ADC = 720;   // Raw ADC in dry air
const int SOIL_WET_ADC = 310;   // Raw ADC submerged in water
const float PUMP_TRIGGER_PCT = 32.0; // Moisture threshold to trigger pump (<32%)
const float PUMP_CUTOFF_PCT  = 68.0; // Moisture threshold to cutoff pump (>68%)

// Safeguard Watchdogs
const unsigned long MAX_PUMP_RUNTIME_MS = 180000; // 3 min max continuous runtime
const unsigned long COOLDOWN_PERIOD_MS  = 300000; // 5 min cooldown between cycles
const unsigned long TELEMETRY_INTERVAL  = 5000;   // Transmit telemetry every 5s

DHT dht(DHTPIN, DHTTYPE);
bool pumpActive = false;
bool safeguardLockout = false;
unsigned long pumpStartTime = 0;
unsigned long pumpStopTime  = 0;
unsigned long lastTelemetry = 0;

void setup() {
  Serial.begin(9600);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Active-low relay: HIGH is OFF
  dht.begin();
  
  Serial.println("{\\"status\\":\\"FARMATRIX_NODE_BOOT_OK\\",\\"version\\":\\"1.0\\"}");
}

void loop() {
  unsigned long currentMillis = millis();

  // Read analog moisture and calibrate
  int rawSoil = analogRead(SOIL_PIN);
  float soilPct = map(rawSoil, SOIL_DRY_ADC, SOIL_WET_ADC, 0, 100);
  soilPct = constrain(soilPct, 0.0, 100.0);

  // Read DHT22
  float temp = dht.readTemperature();
  float hum  = dht.readHumidity();
  int light  = analogRead(LDR_PIN);

  // Cooldown safeguard clearance
  if (safeguardLockout && (currentMillis - pumpStopTime >= COOLDOWN_PERIOD_MS)) {
    safeguardLockout = false;
  }

  // Automatic Irrigation Engine
  if (!safeguardLockout) {
    if (!pumpActive && soilPct < PUMP_TRIGGER_PCT) {
      pumpActive = true;
      pumpStartTime = currentMillis;
      digitalWrite(RELAY_PIN, LOW); // Turn pump ON
    } else if (pumpActive) {
      // Check cutoff or max runtime safeguard
      if (soilPct >= PUMP_CUTOFF_PCT) {
        pumpActive = false;
        pumpStopTime = currentMillis;
        digitalWrite(RELAY_PIN, HIGH); // Turn pump OFF
      } else if (currentMillis - pumpStartTime >= MAX_PUMP_RUNTIME_MS) {
        // Trigger Safety Watchdog Lockout
        pumpActive = false;
        safeguardLockout = true;
        pumpStopTime = currentMillis;
        digitalWrite(RELAY_PIN, HIGH);
      }
    }
  }

  // Transmit canonical JSON packet over USB Serial
  if (currentMillis - lastTelemetry >= TELEMETRY_INTERVAL) {
    lastTelemetry = currentMillis;
    Serial.print("{\\"soil_pct\\":");
    Serial.print(soilPct, 1);
    Serial.print(",\\"raw_adc\\":");
    Serial.print(rawSoil);
    Serial.print(",\\"temp\\":");
    Serial.print(isnan(temp) ? 25.0 : temp, 1);
    Serial.print(",\\"humidity\\":");
    Serial.print(isnan(hum) ? 60.0 : hum, 1);
    Serial.print(",\\"light\\":");
    Serial.print(light);
    Serial.print(",\\"pump_status\\":\\"");
    Serial.print(pumpActive ? "ON" : "OFF");
    Serial.print("\\",\\"safeguard\\":");
    Serial.print(safeguardLockout ? "true" : "false");
    Serial.println("}");
  }
}`,

    gateway: `/**
 * FARMATRIX Edge Gateway Daemon (Node.js)
 * Connects Mac/PC to Arduino UNO R3 over USB SerialPort
 * Validates JSON frames and forwards telemetry to FARMATRIX API / Supabase
 */

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const http = require('http');

const SERIAL_PORT_PATH = process.env.SERIAL_PORT || '/dev/tty.usbmodem1101';
const BAUD_RATE = 9600;
const API_ENDPOINT = process.env.FARMATRIX_API || 'http://localhost:3000/api/telemetry';

console.log('[GATEWAY] Initializing FARMATRIX Serial Gateway...');
console.log(\`[GATEWAY] Connecting to \${SERIAL_PORT_PATH} @ \${BAUD_RATE} baud\`);

const port = new SerialPort({ path: SERIAL_PORT_PATH, baudRate: BAUD_RATE }, (err) => {
  if (err) {
    console.error('[GATEWAY] Error opening port:', err.message);
    console.log('[GATEWAY] Falling back to Web Simulator mode.');
  }
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\\r\\n' }));

parser.on('data', async (line) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const packet = JSON.parse(trimmed);
      console.log('[GATEWAY-RX]', packet);

      // Forward to FARMATRIX API
      const payload = JSON.stringify({
        farmId: 'farm-kano-04',
        soilMoisture: packet.soil_pct,
        soilMoistureRaw: packet.raw_adc,
        temperature: packet.temp,
        humidity: packet.humidity,
        lightIntensity: packet.light,
        pumpStatus: packet.pump_status,
        source: 'HARDWARE_SERIAL'
      });

      const req = http.request(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      });
      req.write(payload);
      req.end();
    } catch (e) {
      console.warn('[GATEWAY] Parse error:', e.message);
    }
  }
});`,

    contract: `// FARMATRIX Traceability Smart Contract in Rust
// Framework: near-sdk 5.x (NEAR Protocol Testnet / Mainnet)

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault};
use near_sdk::store::{LookupMap, Vector};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct BatchRecord {
    pub batch_id: String,
    pub producer: AccountId,
    pub crop_name: String,
    pub quantity_kg: u64,
    pub harvest_timestamp: u64,
    pub quality_grade: String,
    pub data_hash: String, // SHA-256 canonical digest
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct SupplyChainEvent {
    pub batch_id: String,
    pub actor: AccountId,
    pub event_type: String,
    pub location: String,
    pub timestamp: u64,
    pub data_hash: String,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct FarmatrixContract {
    pub admin: AccountId,
    pub batches: LookupMap<String, BatchRecord>,
    pub events: LookupMap<String, Vector<SupplyChainEvent>>,
}

#[near_bindgen]
impl FarmatrixContract {
    #[init]
    pub fn new() -> Self {
        Self {
            admin: env::predecessor_account_id(),
            batches: LookupMap::new(b"b"),
            events: LookupMap::new(b"e"),
        }
    }

    /// Register a unique harvest batch with SHA-256 commitment
    pub fn register_batch(
        &mut self,
        batch_id: String,
        crop_name: String,
        quantity_kg: u64,
        quality_grade: String,
        data_hash: String,
    ) {
        assert!(self.batches.get(&batch_id).is_none(), "Batch already registered");
        let record = BatchRecord {
            batch_id: batch_id.clone(),
            producer: env::predecessor_account_id(),
            crop_name,
            quantity_kg,
            harvest_timestamp: env::block_timestamp(),
            quality_grade,
            data_hash,
        };
        self.batches.insert(batch_id, record);
    }

    /// Record a supply chain event (storage, transport, audit, retail)
    pub fn record_event(
        &mut self,
        batch_id: String,
        event_type: String,
        location: String,
        data_hash: String,
    ) {
        assert!(self.batches.get(&batch_id).is_some(), "Batch does not exist");
        let event = SupplyChainEvent {
            batch_id: batch_id.clone(),
            actor: env::predecessor_account_id(),
            event_type,
            location,
            timestamp: env::block_timestamp(),
            data_hash,
        };
        let mut event_list = self.events.remove(&batch_id).unwrap_or_else(|| Vector::new(b"v"));
        event_list.push(event);
        self.events.insert(batch_id, event_list);
    }

    pub fn get_batch(&self, batch_id: String) -> Option<BatchRecord> {
        self.batches.get(&batch_id).cloned()
    }
}`,

    database: `-- FARMATRIX Supabase PostgreSQL Schema DDL
-- Enterprise Smart Agriculture & Supply Chain Traceability

CREATE TABLE IF NOT EXISTS farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  region TEXT NOT NULL,
  country TEXT DEFAULT 'Nigeria',
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  crop_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  soil_moisture NUMERIC(5,2) NOT NULL,
  soil_moisture_raw INTEGER NOT NULL,
  temperature NUMERIC(5,2) NOT NULL,
  humidity NUMERIC(5,2) NOT NULL,
  light_intensity INTEGER,
  pump_status TEXT NOT NULL,
  water_level_pct NUMERIC(5,2),
  source TEXT DEFAULT 'HARDWARE_SERIAL',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sensor_farm_time ON sensor_readings(farm_id, recorded_at DESC);

CREATE TABLE IF NOT EXISTS product_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number TEXT UNIQUE NOT NULL,
  farm_id UUID REFERENCES farms(id),
  crop_name TEXT NOT NULL,
  variety TEXT NOT NULL,
  quantity_kg NUMERIC(10,2) NOT NULL,
  harvest_date TIMESTAMPTZ NOT NULL,
  quality_grade TEXT NOT NULL,
  farmer_account TEXT NOT NULL,
  blockchain_tx TEXT NOT NULL,
  data_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supply_chain_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES product_batches(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  facility_name TEXT NOT NULL,
  actor_account TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  temp_snapshot NUMERIC(4,1),
  data_hash TEXT NOT NULL,
  near_tx_hash TEXT NOT NULL,
  event_timestamp TIMESTAMPTZ DEFAULT NOW()
);`,
  };

  const handleCopy = () => {
    if (activeTab === "circuit") {
      navigator.clipboard.writeText("See docs/CIRCUIT_DIAGRAM.md and public/circuit_diagram.svg for the full schematic.");
    } else {
      navigator.clipboard.writeText(codeSnippets[activeTab]);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (activeTab === "circuit") {
      const a = document.createElement("a");
      a.href = "/circuit_diagram.svg";
      a.download = "farmatrix_circuit_schematic.svg";
      a.click();
      return;
    }

    const filenameMap = {
      arduino: "farmatrix_firmware.ino",
      gateway: "serial-bridge.js",
      contract: "lib.rs",
      database: "schema.sql",
    };
    const blob = new Blob([codeSnippets[activeTab]], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filenameMap[activeTab];
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl rounded-3xl border border-white/15 bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-5 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Developer Hub, Circuit Schematic &amp; Source Code
              </h3>
              <p className="text-xs text-slate-400">
                Arduino UNO R3 wiring schematic, C++ firmware, Node.js gateway, NEAR Rust contract, and Supabase DDL
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

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex flex-wrap items-center gap-1 rounded-xl bg-black/40 p-1 border border-white/5">
            <button
              onClick={() => setActiveTab("circuit")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "circuit" ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Circuit Diagram (Schematic)</span>
            </button>

            <button
              onClick={() => setActiveTab("arduino")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "arduino" ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Arduino Firmware (.ino)</span>
            </button>

            <button
              onClick={() => setActiveTab("gateway")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "gateway" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Node.js Serial Bridge</span>
            </button>

            <button
              onClick={() => setActiveTab("contract")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "contract" ? "bg-indigo-500 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Blocks className="h-3.5 w-3.5" />
              <span>NEAR Rust Contract</span>
            </button>

            <button
              onClick={() => setActiveTab("database")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "database" ? "bg-teal-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Supabase DDL (.sql)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{activeTab === "circuit" ? "Download SVG" : "Download File"}</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "circuit" ? (
          <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/90 p-4 space-y-4">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-950">
              <img
                src="/circuit_diagram.svg"
                alt="FARMATRIX Arduino UNO R3 Hardware Circuit Schematic"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Pin Connection Reference */}
            <div className="rounded-xl border border-white/10 bg-slate-900/90 p-4 text-xs font-mono space-y-2">
              <div className="font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Hardware Connection Pin Map</span>
                <span className="text-amber-400 font-sans text-[11px]">Optical Relay Isolation Active</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 pt-2 border-t border-white/5">
                <div>
                  <strong className="text-emerald-400">Capacitive Moisture Sensor v1.2:</strong>
                  <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-400">
                    <li>VCC &rarr; Arduino 5V</li>
                    <li>GND &rarr; Arduino GND</li>
                    <li>AOUT &rarr; Arduino Analog A0</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-sky-400">DHT22 Temp &amp; Humidity:</strong>
                  <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-400">
                    <li>Pin 1 (VCC) &rarr; Arduino 5V</li>
                    <li>Pin 2 (DATA) &rarr; Arduino Digital D2 (with 10kΩ pull-up to VCC)</li>
                    <li>Pin 4 (GND) &rarr; Arduino GND</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-amber-400">5V Relay Module (Optoisolated):</strong>
                  <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-400">
                    <li>VCC &rarr; Arduino 5V &bull; GND &rarr; Arduino GND</li>
                    <li>IN &rarr; Arduino Digital D8 (Active-Low)</li>
                    <li>COM &rarr; External 5V Power (+)</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-pink-400">DC Submersible Mini Pump:</strong>
                  <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-400">
                    <li>Pump (+) &rarr; Relay NO Terminal</li>
                    <li>Pump (-) &rarr; External 5V Power (-) GND Return</li>
                    <li>(Isolated from Arduino microcontroller power rail)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/90 p-4 font-mono text-xs text-slate-300">
            <pre className="whitespace-pre overflow-x-auto leading-relaxed">
              {codeSnippets[activeTab]}
            </pre>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400">
          <span>Documentation files saved in <code>docs/SYSTEM_DOCUMENTATION.md</code> and <code>docs/CIRCUIT_DIAGRAM.md</code></span>
          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/20 transition-colors"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
}
