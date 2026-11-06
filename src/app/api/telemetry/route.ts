import { NextRequest, NextResponse } from "next/server";
import { farmatrixStore } from "@/lib/store";
import { SensorReading } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const farmId = searchParams.get("farmId") || "farm-kano-04";

  const history = farmatrixStore.readings[farmId] || [];
  const latest = history[history.length - 1] || null;

  return NextResponse.json({
    success: true,
    farmId,
    latest,
    history: history.slice(-50), // last 50 readings
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const farmId = body.farmId || "farm-kano-04";

    const reading: SensorReading = {
      id: `reading-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      farmId,
      soilMoisture: Number(body.soilMoisture ?? body.soil_pct ?? 45),
      soilMoistureRaw: Number(body.soilMoistureRaw ?? body.soil_raw ?? 550),
      temperature: Number(body.temperature ?? body.temp ?? 25.4),
      humidity: Number(body.humidity ?? 60),
      lightIntensity: Number(body.lightIntensity ?? body.light ?? 24000),
      vaporPressureDeficit: Number(body.vaporPressureDeficit ?? 1.2),
      pumpStatus: body.pumpStatus ?? (body.pump_status === "ON" ? "ON" : "OFF"),
      waterLevelPct: Number(body.waterLevelPct ?? 82),
      recordedAt: new Date().toISOString(),
      source: body.source || "EDGE_GATEWAY",
    };

    if (!farmatrixStore.readings[farmId]) {
      farmatrixStore.readings[farmId] = [];
    }

    farmatrixStore.readings[farmId].push(reading);
    if (farmatrixStore.readings[farmId].length > 200) {
      farmatrixStore.readings[farmId].shift();
    }

    return NextResponse.json({
      success: true,
      data: reading,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
