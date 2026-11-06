import { NextRequest, NextResponse } from "next/server";
import { farmatrixStore } from "@/lib/store";
import { SupplyChainEvent } from "@/lib/types";
import { recordEventOnNear } from "@/lib/nearClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { batchId, eventType, title, location, facilityName, actorAccount, actorRole, notes, temperatureSnapshot, humiditySnapshot } = body;

    const batch = farmatrixStore.batches.find((b) => b.id === batchId || b.batchNumber === batchId);
    if (!batch) {
      return NextResponse.json({ success: false, error: "Batch not found" }, { status: 404 });
    }

    const previousHash = batch.events[batch.events.length - 1]?.dataHash || batch.dataHash;
    const onChain = await recordEventOnNear({
      batchId: batch.id,
      eventType,
      location,
      actorAccount,
      notes: notes || "",
      previousHash,
    });

    const newEvent: SupplyChainEvent = {
      id: `evt-${Date.now()}`,
      batchId: batch.id,
      eventType,
      title: title || eventType.replace(/_/g, " "),
      location,
      facilityName: facilityName || location,
      actorAccount,
      actorRole: actorRole || "Supply Chain Agent",
      timestamp: onChain.blockTimestamp,
      temperatureSnapshot: temperatureSnapshot !== undefined ? Number(temperatureSnapshot) : undefined,
      humiditySnapshot: humiditySnapshot !== undefined ? Number(humiditySnapshot) : undefined,
      dataHash: onChain.dataHash,
      nearTxHash: onChain.txHash,
      blockNumber: onChain.blockNumber,
      gasBurned: "0.00019 NEAR",
      notes: notes || "",
      verified: true,
    };

    batch.events.push(newEvent);

    // Update batch status according to stage
    if (eventType === "LOGISTICS_DISPATCH") batch.status = "IN_TRANSIT";
    else if (eventType === "COLD_STORAGE_DEPOSIT") batch.status = "STORED";
    else if (eventType === "SUPERMARKET_DELIVERY") batch.status = "RETAIL_READY";

    return NextResponse.json({
      success: true,
      event: newEvent,
      batchStatus: batch.status,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
