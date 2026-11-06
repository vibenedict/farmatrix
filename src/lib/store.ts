import { FarmLocation, ProductBatch, SensorReading, IrrigationConfig } from "./types";
import { MOCK_FARMS, INITIAL_BATCHES, generateInitialTelemetryHistory } from "./mockData";

// Global in-memory state shared across server routes and default initial state
declare global {
  // eslint-disable-next-line no-var
  var __FARMATRIX_STATE__: {
    farms: FarmLocation[];
    batches: ProductBatch[];
    readings: Record<string, SensorReading[]>;
    irrigationConfig: Record<string, IrrigationConfig>;
  } | undefined;
}

if (!globalThis.__FARMATRIX_STATE__) {
  const initialReadings: Record<string, SensorReading[]> = {};
  const initialIrrigation: Record<string, IrrigationConfig> = {};

  for (const farm of MOCK_FARMS) {
    initialReadings[farm.id] = generateInitialTelemetryHistory(farm.id);
    initialIrrigation[farm.id] = {
      autoMode: true,
      moistureThresholdLow: 32,
      moistureThresholdHigh: 68,
      maxRuntimeSeconds: 180,
      cooldownPeriodSeconds: 300,
      lastRunTimestamp: new Date(Date.now() - 3600000).toISOString(),
      runtimeElapsedSeconds: 0,
      isSafeguardTriggered: false,
      manualOverride: false,
    };
  }

  globalThis.__FARMATRIX_STATE__ = {
    farms: [...MOCK_FARMS],
    batches: [...INITIAL_BATCHES],
    readings: initialReadings,
    irrigationConfig: initialIrrigation,
  };
}

export const farmatrixStore = globalThis.__FARMATRIX_STATE__;
