"use client";

import React, { useState } from "react";
import { ProductBatch } from "@/lib/types";
import { 
  Boxes, 
  Search, 
  Filter, 
  QrCode, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Droplet, 
  Leaf, 
  GitFork,
  ArrowUpRight
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
            className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none backdrop-blur-md"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-slate-900/80 p-1 border border-white/10">
            {["ALL", "IN_TRANSIT", "STORED", "RETAIL_READY"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  statusFilter === s
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {s === "ALL" ? "All Batches" : s.replace("_", " ")}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenNewBatchModal}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center gap-1.5"
          >
            <span>+ New Batch</span>
          </button>
        </div>
      </div>

      {/* Grid of Batches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((batch) => {
          let statusBadge = "bg-sky-500/10 text-sky-400 border-sky-500/20";
          if (batch.status === "STORED") statusBadge = "bg-amber-500/10 text-amber-400 border-amber-500/20";
          if (batch.status === "RETAIL_READY") statusBadge = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

          return (
            <div
              key={batch.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-5 shadow-xl hover:border-emerald-500/40 transition-all duration-300"
            >
              <div>
                {/* Top Badge & Identifier */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${statusBadge}`}>
                    {batch.status.replace("_", " ")}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-300">
                    {batch.batchNumber}
                  </span>
                </div>

                {/* Crop & Farm */}
                <div className="mt-3">
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {batch.cropName.split(" (")[0]}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">{batch.variety}</p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>Facility:</span>
                    <span className="text-slate-300">{batch.farmName}</span>
                  </p>
                </div>

                {/* Agronomic & ESG Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-black/40 p-3 text-xs border border-white/5 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Quantity</span>
                    <span className="text-white font-bold">{batch.quantityKg.toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Quality Grade</span>
                    <span className="text-emerald-400 font-bold truncate block">{batch.qualityGrade.split(" ")[0]}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Water Index</span>
                    <span className="text-cyan-400">{batch.waterEfficiencyIndex} L/kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Carbon Footprint</span>
                    <span className="text-teal-400">{batch.carbonFootprintKgCO2} kg CO₂</span>
                  </div>
                </div>

                {/* On-Chain Commitment Info */}
                <div className="mt-3 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>NEAR Signer:</span>
                    <span className="font-mono text-[#00ec97] text-[10px]">{batch.farmerNearAccount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tx Commitment:</span>
                    <a
                      href={`${NEAR_CONFIG.explorerUrl}/txns/${batch.blockchainTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-slate-300 hover:text-white truncate max-w-[140px] flex items-center gap-1"
                    >
                      {batch.blockchainTxHash.substring(0, 12)}...
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={() => onOpenQR(batch)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <QrCode className="h-3.5 w-3.5 text-emerald-400" />
                  <span>View QR</span>
                </button>

                <button
                  onClick={() => onSelectBatchForTimeline(batch)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 py-2 px-3 text-xs font-bold text-emerald-300 transition-colors"
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
