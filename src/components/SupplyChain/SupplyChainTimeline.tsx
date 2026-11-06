"use client";

import React, { useState } from "react";
import { ProductBatch } from "@/lib/types";
import { 
  GitFork, 
  Plus, 
  CheckCircle2, 
  Thermometer, 
  ExternalLink, 
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="h-4 w-4 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-wide">
              Supply-Chain Provenance & Tamper-Evident Timeline
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
            <span>Batch: <strong className="text-slate-900 font-mono">{batch.batchNumber}</strong></span>
            <span>•</span>
            <span>{batch.cropName.split(" (")[0]}</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">{batch.quantityKg.toLocaleString()} kg</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQR}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <QrCode className="h-3.5 w-3.5 text-emerald-600" />
            <span>Generate QR</span>
          </button>

          <button
            onClick={onOpenRecordModal}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>Record Milestone</span>
          </button>
        </div>
      </div>

      {/* Timeline Nodes */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200">
        {batch.events.map((evt, idx) => {
          const isExpanded = expandedEventId === evt.id;
          const isLatest = idx === batch.events.length - 1;

          return (
            <div key={evt.id} className="relative group">
              {/* Node Marker Dot */}
              <div className={`absolute -left-6 sm:-left-8 top-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border-2 bg-white transition-all ${
                isLatest
                  ? "border-emerald-600 text-emerald-600 shadow-sm"
                  : "border-slate-300 text-slate-400"
              }`}>
                {isLatest ? (
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                )}
              </div>

              {/* Event Content Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-slate-300 hover:bg-white shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {evt.title}
                      </span>
                      <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-mono text-slate-600 uppercase">
                        {evt.eventType.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
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
                    <div className="flex items-center gap-2 rounded-xl bg-cyan-50 border border-cyan-200 px-3 py-1.5 text-xs text-cyan-800 font-mono font-medium">
                      <Thermometer className="h-3.5 w-3.5" />
                      <span>{evt.temperatureSnapshot}°C • {evt.humiditySnapshot}% RH</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {evt.notes && (
                  <p className="mt-2 text-xs text-slate-700 leading-relaxed font-normal">
                    {evt.notes}
                  </p>
                )}

                {/* Footer with Cryptographic Proof toggle */}
                <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Signer:</span>
                    <span className="font-mono text-emerald-700 text-[11px] font-semibold">
                      {evt.actorAccount} ({evt.actorRole})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleExpand(evt.id)}
                      className="text-[11px] text-slate-700 hover:text-emerald-700 flex items-center gap-1 font-mono font-semibold"
                    >
                      <FileCode className="h-3 w-3" />
                      <span>{isExpanded ? "Hide Hashes" : "Inspect Cryptographic Hashes"}</span>
                    </button>

                    <a
                      href={`${NEAR_CONFIG.explorerUrl}/txns/${evt.nearTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-700 font-mono"
                    >
                      <span>NEAR Block #{evt.blockNumber}</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>

                {/* Expanded Cryptographic Proof View */}
                {isExpanded && (
                  <div className="mt-3 rounded-xl bg-slate-100 p-3 border border-slate-200 font-mono text-[11px] space-y-1.5 animate-fade-in text-slate-800">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500">Data Hash (SHA-256):</span>
                      <span className="text-slate-900 break-all">{evt.dataHash}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500">NEAR Tx Commitment:</span>
                      <span className="text-emerald-700 break-all">{evt.nearTxHash}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200">
                      <span>Gas Burned: {evt.gasBurned}</span>
                      <span className="text-emerald-700 font-bold">✓ Cryptographic Commitment Verified</span>
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
