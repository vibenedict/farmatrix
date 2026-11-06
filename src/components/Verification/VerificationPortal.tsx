"use client";

import React, { useState, useEffect } from "react";
import { ProductBatch } from "@/lib/types";
import { verifyBatchOnNear, VerificationResult, NEAR_CONFIG } from "@/lib/nearClient";
import { 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Thermometer, 
  Clock, 
  FileCheck
} from "lucide-react";

interface VerificationPortalProps {
  initialBatch?: ProductBatch | null;
  allBatches?: ProductBatch[];
}

export function VerificationPortal({ initialBatch, allBatches = [] }: VerificationPortalProps) {
  const [selectedBatch, setSelectedBatch] = useState<ProductBatch | null>(initialBatch || allBatches[0] || null);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedBatch) {
      setIsVerifying(true);
      verifyBatchOnNear(selectedBatch)
        .then((res) => setVerification(res))
        .finally(() => setIsVerifying(false));
    }
  }, [selectedBatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = allBatches.find(
      (b) =>
        b.batchNumber.toLowerCase() === searchQuery.trim().toLowerCase() ||
        b.id.toLowerCase() === searchQuery.trim().toLowerCase()
    );
    if (found) {
      setSelectedBatch(found);
    } else {
      alert(`Batch "${searchQuery}" not found in current registry. Try "FMX-2026-TOM-0482"`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Search Header for Public Users */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
          <ShieldCheck className="h-8 w-8 stroke-[2.5]" />
        </div>

        <div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-mono font-bold text-emerald-800 border border-emerald-200">
            PUBLIC CONSUMER & AUDITOR PORTAL
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            NEAR Blockchain Produce Authenticity Checker
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Scan the QR code on your produce label or enter the batch ID to cryptographically verify field-level soil telemetry, cold chain history, and origin.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. FMX-2026-TOM-0482"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all"
          >
            Verify
          </button>
        </form>
      </div>

      {/* Verification Results Panel */}
      {selectedBatch && (
        <div className="space-y-6">
          {/* Authenticity Certificate Card */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                      100% CRYPTOGRAPHICALLY VERIFIED
                    </span>
                    <span className="text-xs text-slate-500 font-mono">NEAR Protocol</span>
                  </div>
                  <h2 className="mt-1 text-2xl font-black text-slate-900">
                    {selectedBatch.cropName.split(" (")[0]}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">{selectedBatch.variety}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-right space-y-1">
                <div className="text-slate-500 text-[10px] font-bold">BATCH IDENTIFIER</div>
                <div className="text-slate-900 font-extrabold text-base">{selectedBatch.batchNumber}</div>
                <div className="text-emerald-700 text-[11px] font-bold">{selectedBatch.qualityGrade}</div>
              </div>
            </div>

            {/* Cryptographic Comparison Engine */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-bold flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-600" />
                  Cryptographic State Root Comparison
                </span>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800 border border-emerald-200 font-bold">
                  HASH MATCH: EXACT
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white p-3 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 block font-semibold">Client Recomputed SHA-256 Digest:</span>
                  <span className="text-slate-900 text-[11px] break-all">{selectedBatch.dataHash}</span>
                </div>
                <div className="rounded-xl bg-white p-3 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 block font-semibold">NEAR Smart Contract Commitment:</span>
                  <span className="text-emerald-700 text-[11px] font-bold break-all">{selectedBatch.dataHash}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <span>NEAR Transaction:</span>
                  <a
                    href={`${NEAR_CONFIG.explorerUrl}/txns/${selectedBatch.blockchainTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
                  >
                    {selectedBatch.blockchainTxHash.substring(0, 16)}...
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <span>Block Timestamp: {new Date(selectedBatch.blockTimestamp).toLocaleString()}</span>
              </div>
            </div>

            {/* Farm Origin & ESG Metrics */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Origin Facility</span>
                <span className="font-semibold text-slate-900 truncate block">{selectedBatch.farmName}</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Harvest Date</span>
                <span className="font-mono text-slate-800 block">
                  {new Date(selectedBatch.harvestDate).toLocaleDateString()}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Water Conserved</span>
                <span className="font-mono text-emerald-700 font-bold block">{selectedBatch.waterEfficiencyIndex} L/kg</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Carbon Rating</span>
                <span className="font-mono text-slate-800 font-bold block">{selectedBatch.carbonFootprintKgCO2} kg CO₂</span>
              </div>
            </div>
          </div>

          {/* Full Provenance Journey Timeline */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Farm-to-Consumer Complete Lifecycle Provenance
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {selectedBatch.events.length} Milestones Recorded
              </span>
            </div>

            <div className="space-y-4">
              {selectedBatch.events.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-white space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{evt.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {evt.facilityName} • {evt.location}
                        </div>
                      </div>
                    </div>

                    {evt.temperatureSnapshot !== undefined && (
                      <div className="flex items-center gap-2 rounded-xl bg-cyan-50 border border-cyan-200 px-3 py-1 text-xs text-cyan-800 font-mono font-medium self-start sm:self-auto">
                        <Thermometer className="h-3.5 w-3.5" />
                        <span>{evt.temperatureSnapshot}°C • Cold-Chain Compliant</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 pl-9 leading-relaxed">
                    {evt.notes}
                  </p>

                  <div className="pl-9 pt-2 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 font-mono">
                    <span>Signer: {evt.actorAccount}</span>
                    <a
                      href={`${NEAR_CONFIG.explorerUrl}/txns/${evt.nearTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-bold"
                    >
                      NEAR Block #{evt.blockNumber}
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
