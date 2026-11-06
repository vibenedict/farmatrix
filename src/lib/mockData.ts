import { FarmLocation, ProductBatch, SensorReading, AgribusinessMetric } from "./types";

export const MOCK_FARMS: FarmLocation[] = [
  {
    id: "farm-kano-04",
    name: "Kano Green Valley Automated Facility",
    code: "KGV-SEC4",
    region: "Kano Agro-Industrial Basin",
    country: "Nigeria",
    coordinates: { lat: 11.9604, lng: 8.5222 },
    totalAreaHectares: 145.8,
    activeSensors: 48,
    manager: "Eng. Amina Al-Hassan",
    cropType: "Heirloom Tomato (Solanum lycopersicum)",
    establishedDate: "2023-04-12",
    pwcAgriZone: "Zone A - High Irrigation Potential",
  },
  {
    id: "farm-ogun-02",
    name: "Ogun Precision Agro-Logistics Cluster",
    code: "OPC-HUB2",
    region: "Sagamu Gateway Industrial Zone",
    country: "Nigeria",
    coordinates: { lat: 6.8485, lng: 3.6468 },
    totalAreaHectares: 280.0,
    activeSensors: 92,
    manager: "Babatunde Adeleke, MSc",
    cropType: "Yellow Dent Maize (Zea mays)",
    establishedDate: "2022-09-18",
    pwcAgriZone: "Zone C - Grain Processing & Export",
  },
  {
    id: "farm-jos-01",
    name: "Plateau Highland Micro-Climate Terraces",
    code: "PMC-TER1",
    region: "Jos Plateau High Altitude Zone",
    country: "Nigeria",
    coordinates: { lat: 9.8965, lng: 8.8583 },
    totalAreaHectares: 96.5,
    activeSensors: 36,
    manager: "Dr. Mary Pam Dung",
    cropType: "Export Grade Hass Avocado (Persea americana)",
    establishedDate: "2024-01-10",
    pwcAgriZone: "Zone B - Temperate Horticulture",
  },
];

// Initial realistic 24-hour telemetry curve
export function generateInitialTelemetryHistory(farmId: string): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now - i * oneHour).toISOString();
    // Diurnal temperature cycle: peaks at noon, drops at night
    const hour = new Date(now - i * oneHour).getHours();
    const tempBase = 22 + Math.sin(((hour - 6) / 24) * 2 * Math.PI) * 7;
    const temp = Number((tempBase + (Math.random() * 0.8 - 0.4)).toFixed(1));
    
    // Humidity inversely related to temp
    const humidity = Math.min(92, Math.max(38, Math.round(82 - (temp - 20) * 2.8 + (Math.random() * 4 - 2))));
    
    // Soil moisture slowly drops until pump triggers, or varies between 28% and 72%
    let soilMoisture = 42 + Math.sin((i / 8) * Math.PI) * 16;
    if (i % 8 === 0) soilMoisture = 27.5; // low dip triggering pump
    if (i % 8 === 7) soilMoisture = 68.2; // post-pump
    soilMoisture = Number(Math.max(22, Math.min(85, soilMoisture + (Math.random() * 2 - 1))).toFixed(1));
    
    const isIrrigating = soilMoisture < 32;
    const pumpStatus = isIrrigating ? "AUTO_IRRIGATING" : "OFF";
    const soilRaw = Math.round(720 - (soilMoisture / 100) * 400);

    // Vapor Pressure Deficit (VPD in kPa)
    const svp = 0.61078 * Math.exp((17.27 * temp) / (temp + 237.3));
    const avp = svp * (humidity / 100);
    const vpd = Number((svp - avp).toFixed(2));

    const light = (hour >= 6 && hour <= 18) 
      ? Math.round(Math.sin(((hour - 6) / 12) * Math.PI) * 48000 + Math.random() * 2000)
      : 0;

    readings.push({
      id: `telemetry-${farmId}-${i}`,
      farmId,
      soilMoisture,
      soilMoistureRaw: soilRaw,
      temperature: temp,
      humidity,
      lightIntensity: light,
      vaporPressureDeficit: vpd,
      pumpStatus,
      waterLevelPct: Number((84 - i * 0.4).toFixed(1)),
      recordedAt: timestamp,
      source: "HARDWARE_SERIAL",
    });
  }

  return readings;
}

export const INITIAL_BATCHES: ProductBatch[] = [
  {
    id: "batch-fmx-tom-0482",
    batchNumber: "FMX-2026-TOM-0482",
    farmId: "farm-kano-04",
    farmName: "Kano Green Valley Automated Facility",
    cropName: "Heirloom Tomato (Solanum lycopersicum)",
    variety: "Roma Special Red Cluster",
    quantityKg: 2450,
    harvestDate: "2026-11-04T07:30:00Z",
    bestBeforeDate: "2026-11-25T00:00:00Z",
    qualityGrade: "Grade A+ (Export Certified)",
    farmerNearAccount: "kano-valleys.agri.near",
    soilMoistureAtHarvest: 48.5,
    avgGrowthTemp: 24.8,
    waterEfficiencyIndex: 14.2, // L/kg
    carbonFootprintKgCO2: 0.18,
    blockchainTxHash: "7bKx9NmP3QvW1tZ8eR5sT2yU4oP6aL9kH3jF8dC1mX7q",
    blockTimestamp: "2026-11-04T08:15:22Z",
    dataHash: "0x8f3c7b2e9d0a1b4c6e8f2a4c6e8f0a2b4c6e8f1a3b5c7d9e1f3a5b7c9d1e3f5a",
    status: "IN_TRANSIT",
    events: [
      {
        id: "evt-01",
        batchId: "batch-fmx-tom-0482",
        eventType: "HARVEST_AND_CURING",
        title: "Harvest Completed & Moisture Cured",
        location: "Kano Valley Hydro-Sector 4",
        facilityName: "Kano Precision Farm Packhouse",
        actorAccount: "kano-valleys.agri.near",
        actorRole: "Master Agronomist",
        timestamp: "2026-11-04T07:30:00Z",
        temperatureSnapshot: 23.4,
        humiditySnapshot: 54,
        dataHash: "0x4a7e9f3b2c1d0e5a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a",
        nearTxHash: "9bLx7KmQ4PvW2tZ1eR8sT5yU6oP9aL2kH5jF1dC4mX3p",
        blockNumber: 118489201,
        gasBurned: "0.00018 NEAR",
        notes: "Automated drip irrigation harvested at optimum Brix 5.8 sugar content. Zero chemical residue detected.",
        verified: true,
      },
      {
        id: "evt-02",
        batchId: "batch-fmx-tom-0482",
        eventType: "COLD_STORAGE_DEPOSIT",
        title: "Cold Chain Ingestion & Pre-Cooling",
        location: "Kaduna Agri-Logistics Terminal",
        facilityName: "ColdHubs Enterprise Facility #07",
        actorAccount: "coldhubs-operator.near",
        actorRole: "Cold Chain Quality Officer",
        timestamp: "2026-11-04T15:45:00Z",
        temperatureSnapshot: 11.8,
        humiditySnapshot: 85,
        dataHash: "0x2e8f1a4c6b8d0e3f7a9c1b3d5e7f9a1c3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b",
        nearTxHash: "4cNx2PmR8QvW5tZ7eR2sT9yU1oP4aL7kH8jF4dC7mX9q",
        blockNumber: 118490334,
        gasBurned: "0.00019 NEAR",
        notes: "Hydro-cooled to 11.8°C core temperature within 4 hours of field pick. Relative humidity held at 85%.",
        verified: true,
      },
      {
        id: "evt-03",
        batchId: "batch-fmx-tom-0482",
        eventType: "QUALITY_AUDIT_PASSED",
        title: "PwC Agri-Standard & GlobalG.A.P. Audit",
        location: "Abuja Federal Quality Testing Lab",
        facilityName: "National Agro-Sanitary Certification Bureau",
        actorAccount: "quality-auditor.near",
        actorRole: "Accredited Supply-Chain Inspector",
        timestamp: "2026-11-05T10:20:00Z",
        temperatureSnapshot: 12.0,
        humiditySnapshot: 84,
        dataHash: "0x7a9c3e5f1b3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f",
        nearTxHash: "2aKx1NmP9QvW3tZ6eR4sT8yU3oP7aL1kH6jF9dC2mX8r",
        blockNumber: 118491502,
        gasBurned: "0.00021 NEAR",
        notes: "Spectral firmness verified at 88/100. Certified Grade A+ Export. Digital compliance seal minted on NEAR.",
        verified: true,
      },
      {
        id: "evt-04",
        batchId: "batch-fmx-tom-0482",
        eventType: "LOGISTICS_DISPATCH",
        title: "Refrigerated Smart Fleet Transit",
        location: "Lagos Corridor Highway KM 124",
        facilityName: "Kobo360 Smart Reefer Fleet #TR-884",
        actorAccount: "logistics-dispatch.near",
        actorRole: "Fleet Telematics Supervisor",
        timestamp: "2026-11-06T04:10:00Z",
        temperatureSnapshot: 11.5,
        humiditySnapshot: 86,
        dataHash: "0x1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c",
        nearTxHash: "8bMx3KmP1QvW7tZ4eR6sT1yU8oP2aL5kH1jF3dC9mX4s",
        blockNumber: 118492810,
        gasBurned: "0.00017 NEAR",
        notes: "Active IoT reefer telemetry stream synced to NEAR contract every 60 minutes. Zero temperature excursions.",
        verified: true,
      },
    ],
  },
  {
    id: "batch-fmx-maz-8819",
    batchNumber: "FMX-2026-MAZ-8819",
    farmId: "farm-ogun-02",
    farmName: "Ogun Precision Agro-Logistics Cluster",
    cropName: "Yellow Dent Maize (Zea mays)",
    variety: "SAMMAZ 52 Hybrid Drought-Tolerant",
    quantityKg: 12800,
    harvestDate: "2026-11-02T11:00:00Z",
    bestBeforeDate: "2027-05-01T00:00:00Z",
    qualityGrade: "Grade A (Premium Retail)",
    farmerNearAccount: "ogun-cluster.agri.near",
    soilMoistureAtHarvest: 22.1,
    avgGrowthTemp: 28.2,
    waterEfficiencyIndex: 38.6,
    carbonFootprintKgCO2: 0.12,
    blockchainTxHash: "3mNx5KmP9QvW2tZ8eR1sT4yU7oP3aL8kH2jF6dC5mX1t",
    blockTimestamp: "2026-11-02T12:04:19Z",
    dataHash: "0x3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f",
    status: "STORED",
    events: [
      {
        id: "evt-maz-01",
        batchId: "batch-fmx-maz-8819",
        eventType: "HARVEST_AND_CURING",
        title: "Grain Combine Harvest & Silo Intake",
        location: "Sagamu Gateway Agro-Park",
        facilityName: "Ogun Silo Complex Beta",
        actorAccount: "ogun-cluster.agri.near",
        actorRole: "Operations Director",
        timestamp: "2026-11-02T11:00:00Z",
        temperatureSnapshot: 29.1,
        humiditySnapshot: 48,
        dataHash: "0x9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b",
        nearTxHash: "5bLx9KmQ1PvW4tZ3eR7sT2yU9oP1aL6kH4jF8dC2mX6u",
        blockNumber: 118465109,
        gasBurned: "0.00018 NEAR",
        notes: "Moisture content verified at 13.2% suitable for 6-month sealed anaerobic storage.",
        verified: true,
      },
    ],
  },
  {
    id: "batch-fmx-avo-1044",
    batchNumber: "FMX-2026-AVO-1044",
    farmId: "farm-jos-01",
    farmName: "Plateau Highland Micro-Climate Terraces",
    cropName: "Export Grade Hass Avocado (Persea americana)",
    variety: "Highland Hass Organic Export Selection",
    quantityKg: 5200,
    harvestDate: "2026-10-29T08:00:00Z",
    bestBeforeDate: "2026-11-28T00:00:00Z",
    qualityGrade: "Grade A+ (Export Certified)",
    farmerNearAccount: "plateau-highland.agri.near",
    soilMoistureAtHarvest: 55.4,
    avgGrowthTemp: 19.4,
    waterEfficiencyIndex: 52.1,
    carbonFootprintKgCO2: 0.22,
    blockchainTxHash: "6kPx4KmN2QvW8tZ5eR3sT9yU2oP8aL3kH7jF1dC8mX2w",
    blockTimestamp: "2026-10-29T09:12:44Z",
    dataHash: "0x5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d",
    status: "RETAIL_READY",
    events: [
      {
        id: "evt-avo-01",
        batchId: "batch-fmx-avo-1044",
        eventType: "HARVEST_AND_CURING",
        title: "Selective Manual Harvest",
        location: "Jos Altitude Terraces Plot 9",
        facilityName: "Plateau Highland Organic Station",
        actorAccount: "plateau-highland.agri.near",
        actorRole: "Harvest Master",
        timestamp: "2026-10-29T08:00:00Z",
        temperatureSnapshot: 18.2,
        humiditySnapshot: 62,
        dataHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        nearTxHash: "1kPx7KmN9QvW1tZ3eR5sT2yU4oP6aL8kH9jF2dC4mX7z",
        blockNumber: 118390450,
        gasBurned: "0.00019 NEAR",
        notes: "Dry matter percentage tested at 25.4%, optimal oil profile achieved under precision automated drip irrigation.",
        verified: true,
      },
      {
        id: "evt-avo-02",
        batchId: "batch-fmx-avo-1044",
        eventType: "SUPERMARKET_DELIVERY",
        title: "Supermarket Shelf Verification",
        location: "Victoria Island, Lagos",
        facilityName: "Ebeano Luxury Supermarket Flagship Store",
        actorAccount: "ebeano-retail.near",
        actorRole: "Store Quality Director",
        timestamp: "2026-11-01T14:30:00Z",
        temperatureSnapshot: 14.0,
        humiditySnapshot: 65,
        dataHash: "0x3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a",
        nearTxHash: "4mKx2PmN8QvW6tZ4eR1sT7yU3oP5aL9kH2jF5dC7mX1y",
        blockNumber: 118420114,
        gasBurned: "0.00018 NEAR",
        notes: "Inspected and verified with 100% cryptographic batch history. Shelf QR code activated for consumer transparency.",
        verified: true,
      },
    ],
  },
];

export const PWC_AGRIBUSINESS_METRICS: AgribusinessMetric[] = [
  {
    title: "Post-Harvest Loss Reduction",
    value: "-42.8%",
    change: "+12.4% vs baseline",
    isPositive: true,
    pwcBenchmark: "PwC Nigeria Target: <15% overall loss",
    description: "Real-time cold chain telemetry and predictive harvest scheduling mitigate spoilage in perishable produce.",
  },
  {
    title: "Irrigation Water Conservation",
    value: "38.4%",
    change: "1.42M Liters saved",
    isPositive: true,
    pwcBenchmark: "PwC Agri Benchmark: 25% efficiency gain",
    description: "Capacitive threshold-triggered micro-irrigation eliminates over-watering and soil nutrient leaching.",
  },
  {
    title: "On-Chain Traceability Premium",
    value: "+18.5%",
    change: "Market price premium",
    isPositive: true,
    pwcBenchmark: "PwC Export Competitiveness Indicator",
    description: "NEAR tamper-evident cryptographic batch history enables export compliance and premium supermarket pricing.",
  },
  {
    title: "Carbon Offset Footprint",
    value: "4.82 tCO2e",
    change: "Net negative carbon index",
    isPositive: true,
    pwcBenchmark: "ESG Standard ISO 14064-1",
    description: "Solar-backed pump relay automation and optimized fleet transit significantly lower fuel consumption.",
  },
];
