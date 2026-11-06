"use client";

import React, { useState } from "react";
import { ProductBatch } from "@/lib/types";
import { 
  Search, 
  QrCode, 
  ExternalLink, 
  GitFork
} from "lucide-react";
import { NEAR_CONFIG } from "@/lib/nearClient";

interface BatchListProps {
  batches: ProductBatch[];
  onOpenQR: (batch: ProductBatch) => void;
  onSelectBatchForTimeline: (batch: ProductBatch) => void;
  onOpenNewBatchModal: () => void;
}

export function BatchList({
  batches,
  onOpenQR,
  onSelectBatchForTimeline,
  onOpenNewBatchModal,
}: BatchListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = batches.filter((b) => {
    const matchesSearch =
      b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.farmName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by batch number, crop variety, or facility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
            {["ALL", "IN_TRANSIT", "STORED", "RETAIL_READY"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  statusFilter === s
                    ? "bg-white text-emerald-950 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {s === "ALL" ? "All Batches" : s.replace("_", " ")}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenNewBatchModal}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>+ New Batch</span>
          </button>
        </div>
      </div>

      {/* Grid of Batches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((batch) => {
          let statusBadge = "bg-sky-50 text-sky-800 border-sky-200";
          if (batch.status === "STORED") statusBadge = "bg-amber-50 text-amber-800 border-amber-200";
          if (batch.status === "RETAIL_READY") statusBadge = "bg-emerald-50 text-emerald-800 border-emerald-200";

          return (
            <div
              key={batch.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-200"
            >
              <div>
                {/* Top Badge & Identifier */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${statusBadge}`}>
                    {batch.status.replace("_", " ")}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700">
                    {batch.batchNumber}
                  </span>
                </div>

                {/* Crop & Farm */}
                <div className="mt-3">
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {batch.cropName.split(" (")[0]}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">{batch.variety}</p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <span>Facility:</span>
                    <span className="text-slate-800 font-medium">{batch.farmName}</span>
                  </p>
                </div>

                {/* Agronomic & ESG Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs border border-slate-100 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Quantity</span>
                    <span className="text-slate-900 font-bold">{batch.quantityKg.toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Quality Grade</span>
                    <span className="text-emerald-700 font-bold truncate block">{batch.qualityGrade.split(" ")[0]}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Water Index</span>
                    <span className="text-slate-700 font-medium">{batch.waterEfficiencyIndex} L/kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Carbon Footprint</span>
                    <span className="text-slate-700 font-medium">{batch.carbonFootprintKgCO2} kg CO₂</span>
                  </div>
                </div>

                {/* On-Chain Commitment Info */}
                <div className="mt-3 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>NEAR Signer:</span>
                    <span className="font-mono text-emerald-700 text-[10px] font-semibold">{batch.farmerNearAccount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tx Commitment:</span>
                    <a
                      href={`${NEAR_CONFIG.explorerUrl}/txns/${batch.blockchainTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-slate-700 hover:text-emerald-700 truncate max-w-[140px] flex items-center gap-1"
                    >
                      {batch.blockchainTxHash.substring(0, 12)}...
                      <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onOpenQR(batch)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2 px-3 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                >
                  <QrCode className="h-3.5 w-3.5 text-emerald-600" />
                  <span>View QR</span>
                </button>

                <button
                  onClick={() => onSelectBatchForTimeline(batch)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 py-2 px-3 text-xs font-bold text-emerald-800 transition-colors shadow-2xs"
                >
                  <GitFork className="h-3.5 w-3.5" />
                  <span>Track Timeline</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
