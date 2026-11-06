export type CropType = 
  | "Heirloom Tomato (Solanum lycopersicum)"
  | "Yellow Dent Maize (Zea mays)"
  | "Premium Cocoa (Theobroma cacao)"
  | "Export Grade Hass Avocado (Persea americana)"
  | "Bell Pepper (Capsicum annuum)"
  | "Cassava (Manihot esculenta)";

export type QualityGrade = "Grade A+ (Export Certified)" | "Grade A (Premium Retail)" | "Grade B (Processing Quality)";

export type PumpStatus = "OFF" | "ON" | "AUTO_IRRIGATING" | "COOLDOWN_PROTECTION" | "EMERGENCY_SHUTDOWN";

export interface SensorReading {
  id: string;
  farmId: string;
  soilMoisture: number; // Percentage: 0 - 100%
  soilMoistureRaw: number; // Raw analog ADC: 0 - 1023
  temperature: number; // Celsius
  humidity: number; // % RH
  lightIntensity: number; // Lux
  vaporPressureDeficit: number; // kPa
  pumpStatus: PumpStatus;
  waterLevelPct: number; // % of reservoir
  recordedAt: string; // ISO 8601
  source: "HARDWARE_SERIAL" | "WEB_SIMULATOR" | "EDGE_GATEWAY";
}

export interface FarmLocation {
  id: string;
  name: string;
  code: string;
  region: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  totalAreaHectares: number;
  activeSensors: number;
  manager: string;
  cropType: CropType;
  establishedDate: string;
  pwcAgriZone: string;
}

export type SupplyChainEventType = 
  | "HARVEST_AND_CURING"
  | "COLD_STORAGE_DEPOSIT"
  | "QUALITY_AUDIT_PASSED"
  | "LOGISTICS_DISPATCH"
  | "PORT_CUSTOMS_CLEARANCE"
  | "DISTRIBUTION_CENTER_RECEIPT"
  | "SUPERMARKET_DELIVERY";

export interface SupplyChainEvent {
  id: string;
  batchId: string;
  eventType: SupplyChainEventType;
  title: string;
  location: string;
  facilityName: string;
  actorAccount: string; // NEAR account or Enterprise DID
  actorRole: string;
  timestamp: string;
  temperatureSnapshot?: number;
  humiditySnapshot?: number;
  dataHash: string; // SHA-256 hash of event details
  nearTxHash: string; // NEAR blockchain transaction hash
  blockNumber: number;
  gasBurned: string;
  notes: string;
  verified: boolean;
}

export interface ProductBatch {
  id: string;
  batchNumber: string; // EAN / Enterprise batch ID e.g. "FMX-2026-TOM-0482"
  farmId: string;
  farmName: string;
  cropName: CropType;
  variety: string;
  quantityKg: number;
  harvestDate: string;
  bestBeforeDate: string;
  qualityGrade: QualityGrade;
  farmerNearAccount: string;
  soilMoistureAtHarvest: number;
  avgGrowthTemp: number;
  waterEfficiencyIndex: number; // Liters per kg produced
  carbonFootprintKgCO2: number;
  blockchainTxHash: string;
  blockTimestamp: string;
  dataHash: string; // SHA-256
  status: "IN_TRANSIT" | "STORED" | "RETAIL_READY" | "COMPLETED";
  qrCodeUrl?: string;
  events: SupplyChainEvent[];
}

export interface IrrigationConfig {
  autoMode: boolean;
  moistureThresholdLow: number; // Threshold to start pump (e.g. 30%)
  moistureThresholdHigh: number; // Threshold to stop pump (e.g. 65%)
  maxRuntimeSeconds: number; // Safety limit (e.g. 180s)
  cooldownPeriodSeconds: number; // Cooldown (e.g. 300s)
  lastRunTimestamp: string | null;
  runtimeElapsedSeconds: number;
  isSafeguardTriggered: boolean;
  manualOverride: boolean;
}

export interface NearNetworkStatus {
  networkId: "testnet" | "mainnet";
  contractId: string;
  connected: boolean;
  account: string;
  balanceNear: number;
  lastBlockHeight: number;
  rpcLatencyMs: number;
  isSyncing: boolean;
}

export interface AgribusinessMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  pwcBenchmark: string;
  description: string;
}
