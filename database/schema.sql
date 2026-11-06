-- =========================================================
-- FARMATRIX Enterprise PostgreSQL Schema for Supabase
-- Smart Agriculture Monitoring & NEAR Blockchain Traceability
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Farms / Production Facilities
CREATE TABLE IF NOT EXISTS farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  region TEXT NOT NULL,
  country TEXT DEFAULT 'Nigeria',
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  total_area_hectares NUMERIC(8,2) NOT NULL,
  active_sensors INTEGER DEFAULT 12,
  crop_type TEXT NOT NULL,
  manager_name TEXT,
  pwc_agri_zone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sensor Readings (High-throughput IoT Telemetry)
CREATE TABLE IF NOT EXISTS sensor_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  soil_moisture NUMERIC(5,2) NOT NULL,        -- Percentage: 0.0 - 100.0%
  soil_moisture_raw INTEGER NOT NULL,          -- Raw ADC reading: 0 - 1023
  temperature NUMERIC(5,2) NOT NULL,            -- Celsius
  humidity NUMERIC(5,2) NOT NULL,               -- Relative Humidity %
  light_intensity INTEGER,                     -- Lux
  vapor_pressure_deficit NUMERIC(5,2),         -- kPa
  pump_status TEXT NOT NULL DEFAULT 'OFF',     -- 'OFF', 'ON', 'AUTO_IRRIGATING', etc.
  water_level_pct NUMERIC(5,2) DEFAULT 85.0,
  source TEXT DEFAULT 'HARDWARE_SERIAL',        -- 'HARDWARE_SERIAL' or 'WEB_SIMULATOR'
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for time-series queries
CREATE INDEX IF NOT EXISTS idx_sensor_readings_farm_time 
ON sensor_readings (farm_id, recorded_at DESC);

-- 3. Product Batches (Certified Harvest Units)
CREATE TABLE IF NOT EXISTS product_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_number TEXT UNIQUE NOT NULL,           -- e.g. 'FMX-2026-TOM-0482'
  farm_id UUID NOT NULL REFERENCES farms(id),
  crop_name TEXT NOT NULL,
  variety TEXT NOT NULL,
  quantity_kg NUMERIC(10,2) NOT NULL,
  harvest_date TIMESTAMPTZ NOT NULL,
  best_before_date TIMESTAMPTZ,
  quality_grade TEXT NOT NULL,
  farmer_account TEXT NOT NULL,                -- NEAR Account ID
  soil_moisture_at_harvest NUMERIC(5,2),
  avg_growth_temp NUMERIC(5,2),
  water_efficiency_index NUMERIC(6,2),         -- Liters / kg produce
  carbon_footprint_kg_co2 NUMERIC(6,2),
  blockchain_tx TEXT NOT NULL,                 -- NEAR Transaction Hash
  data_hash TEXT NOT NULL,                     -- SHA-256 Digest
  status TEXT DEFAULT 'STORED',                -- 'IN_TRANSIT', 'STORED', 'RETAIL_READY'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Supply Chain Events (Tamper-evident Provenance Milestones)
CREATE TABLE IF NOT EXISTS supply_chain_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES product_batches(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,                    -- 'HARVEST', 'COLD_STORAGE', 'LOGISTICS', etc.
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  facility_name TEXT NOT NULL,
  actor_account TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  temperature_snapshot NUMERIC(4,1),           -- Cold-chain audit verification
  humidity_snapshot NUMERIC(4,1),
  data_hash TEXT NOT NULL,                     -- SHA-256 of canonical event record
  near_tx_hash TEXT NOT NULL,                  -- NEAR transaction receipt
  block_number BIGINT,
  gas_burned TEXT,
  notes TEXT,
  verified BOOLEAN DEFAULT TRUE,
  event_timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supply_events_batch 
ON supply_chain_events (batch_id, event_timestamp ASC);

-- 5. Row Level Security Policies (Supabase RLS)
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_events ENABLE ROW LEVEL SECURITY;

-- Allow public read for consumer transparency verification
CREATE POLICY "Public read for farms" ON farms FOR SELECT USING (true);
CREATE POLICY "Public read for sensor_readings" ON sensor_readings FOR SELECT USING (true);
CREATE POLICY "Public read for product_batches" ON product_batches FOR SELECT USING (true);
CREATE POLICY "Public read for supply_chain_events" ON supply_chain_events FOR SELECT USING (true);
