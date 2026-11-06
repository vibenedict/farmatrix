import { NextRequest, NextResponse } from "next/server";
import { farmatrixStore } from "@/lib/store";
import { ProductBatch } from "@/lib/types";
import { registerBatchOnNear } from "@/lib/nearClient";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const farmId = searchParams.get("farmId");
  const batchId = searchParams.get("batchId");

  if (batchId) {
    const found = farmatrixStore.batches.find((b) => b.id === batchId || b.batchNumber === batchId);
    if (!found) {
      return NextResponse.json({ success: false, error: "Batch not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, batch: found });
  }

  let results = farmatrixStore.batches;
  if (farmId) {
    results = results.filter((b) => b.farmId === farmId);
  }

  return NextResponse.json({
    success: true,
    total: results.length,
    batches: results,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const batchNumber = body.batchNumber || `FMX-2026-${body.cropCode || "CRP"}-${Math.floor(1000 + Math.random() * 9000)}`;

    const onChain = await registerBatchOnNear({
      batchNumber,
      farmId: body.farmId,
      cropName: body.cropName,
      variety: body.variety,
      quantityKg: Number(body.quantityKg),
      harvestDate: body.harvestDate || new Date().toISOString(),
      qualityGrade: body.qualityGrade || "Grade A+ (Export Certified)",
      farmerNearAccount: body.farmerNearAccount || "farmatrix-enterprise.near",
    });

    const newBatch: ProductBatch = {
      id: `batch-${Date.now()}`,
      batchNumber,
      farmId: body.farmId,
      farmName: body.farmName || "Enterprise Facility",
      cropName: body.cropName,
      variety: body.variety || "Selected Premium Variety",
      quantityKg: Number(body.quantityKg),
      harvestDate: body.harvestDate || new Date().toISOString(),
      bestBeforeDate: body.bestBeforeDate || new Date(Date.now() + 21 * 86400000).toISOString(),
      qualityGrade: body.qualityGrade || "Grade A+ (Export Certified)",
      farmerNearAccount: body.farmerNearAccount || "farmatrix-enterprise.near",
      soilMoistureAtHarvest: Number(body.soilMoistureAtHarvest ?? 42.5),
      avgGrowthTemp: Number(body.avgGrowthTemp ?? 24.5),
      waterEfficiencyIndex: Number(body.waterEfficiencyIndex ?? 16.8),
      carbonFootprintKgCO2: Number(body.carbonFootprintKgCO2 ?? 0.19),
      blockchainTxHash: onChain.txHash,
      blockTimestamp: onChain.blockTimestamp,
      dataHash: onChain.dataHash,
      status: "STORED",
      events: [
        {
          id: `evt-init-${Date.now()}`,
          batchId: `batch-${Date.now()}`,
          eventType: "HARVEST_AND_CURING",
          title: "Harvest Intake & Digital Registration",
          location: body.farmName || "Primary Field Station",
          facilityName: "Farm Gate Telemetry Verification Hub",
          actorAccount: body.farmerNearAccount || "farmatrix-enterprise.near",
          actorRole: "Certified Producer",
          timestamp: new Date().toISOString(),
          temperatureSnapshot: Number(body.avgGrowthTemp ?? 24.5),
          humiditySnapshot: 62,
          dataHash: onChain.dataHash,
          nearTxHash: onChain.txHash,
          blockNumber: 118492025,
          gasBurned: "0.00018 NEAR",
          notes: "Initial on-chain registration. Cryptographic payload committed to NEAR contract.",
          verified: true,
        },
      ],
    };

    farmatrixStore.batches.unshift(newBatch);

    return NextResponse.json({
      success: true,
      batch: newBatch,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
