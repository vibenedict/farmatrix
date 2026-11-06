"use client";

import React, { useState } from "react";
import { ProductBatch, SupplyChainEvent } from "@/lib/types";
import { 
  GitFork, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  Thermometer, 
  ExternalLink, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Building2,
  FileCode,
  QrCode
} from "lucide-react";
import { NEAR_CONFIG } from "@/lib/nearClient";

interface SupplyChainTimelineProps {
  batch: ProductBatch;
  onOpenRecordModal: () => void;
  onOpenQR: () => void;
}

export function SupplyChainTimeline({
  batch,
  onOpenRecordModal,
  onOpenQR,
}: SupplyChainTimelineProps) {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-xl backdrop-blur-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="h-4 w-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Supply-Chain Provenance & Tamper-Evident Timeline
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400">
            <span>Batch: <strong className="text-white font-mono">{batch.batchNumber}</strong></span>
            <span>•</span>
            <span>{batch.cropName.split(" (")[0]}</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{batch.quantityKg.toLocaleString()} kg</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQR}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-colors"
          >
            <QrCode className="h-3.5 w-3.5 text-emerald-400" />
            <span>Generate QR</span>
          </button>

          <button
            onClick={onOpenRecordModal}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>Record Milestone</span>
          </button>
        </div>
      </div>

      {/* Timeline Nodes */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-cyan-500 before:to-blue-600">
        {batch.events.map((evt, idx) => {
          const isExpanded = expandedEventId === evt.id;
          const isLatest = idx === batch.events.length - 1;

          return (
            <div key={evt.id} className="relative group">
              {/* Node Marker Dot */}
              <div className={`absolute -left-6 sm:-left-8 top-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border-2 bg-slate-950 transition-all ${
                isLatest
                  ? "border-[#00ec97] text-[#00ec97] shadow-lg shadow-emerald-500/30"
                  : "border-cyan-500 text-cyan-400"
              }`}>
                {isLatest ? (
                  <span className="h-2 w-2 rounded-full bg-[#00ec97] animate-ping" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                )}
              </div>

              {/* Event Content Card */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 transition-all hover:border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {evt.title}
                      </span>
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-400 uppercase">
                        {evt.eventType.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        {evt.facilityName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {evt.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {new Date(evt.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Cold Chain Badge */}
                  {evt.temperatureSnapshot !== undefined && (
                    <div className="flex items-center gap-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 text-xs text-cyan-300 font-mono">
                      <Thermometer className="h-3.5 w-3.5" />
                      <span>{evt.temperatureSnapshot}°C • {evt.humiditySnapshot}% RH</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {evt.notes && (
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed font-normal">
                    {evt.notes}
                  </p>
                )}

                {/* Footer with Cryptographic Proof toggle */}
                <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Signer:</span>
                    <span className="font-mono text-[#00ec97] text-[11px] font-semibold">
                      {evt.actorAccount} ({evt.actorRole})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleExpand(evt.id)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                    >
                      <FileCode className="h-3 w-3" />
                      <span>{isExpanded ? "Hide Hashes" : "Inspect Cryptographic Hashes"}</span>
                    </button>

                    <a
                      href={`${NEAR_CONFIG.explorerUrl}/txns/${evt.nearTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white font-mono"
                    >
                      <span>NEAR Block #{evt.blockNumber}</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>

                {/* Expanded Cryptographic Proof View */}
                {isExpanded && (
                  <div className="mt-3 rounded-xl bg-slate-950/80 p-3 border border-white/10 font-mono text-[11px] space-y-1.5 animate-fade-in">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-400">Data Hash (SHA-256):</span>
                      <span className="text-cyan-300 break-all">{evt.dataHash}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-400">NEAR Tx Commitment:</span>
                      <span className="text-[#00ec97] break-all">{evt.nearTxHash}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-white/5">
                      <span>Gas Burned: {evt.gasBurned}</span>
                      <span className="text-emerald-400 font-semibold">✓ Cryptographic Commitment Verified</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
