"use client";

import React, { useState, useEffect } from "react";
import { ProductBatch, SupplyChainEventType, SupplyChainEvent } from "@/lib/types";
import { GitFork, ShieldCheck, Thermometer } from "lucide-react";
import confetti from "canvas-confetti";
import { useWallet } from "@/context/WalletContext";

interface RecordEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: ProductBatch;
  onEventAdded: (event: SupplyChainEvent) => void;
}

export function RecordEventModal({
  isOpen,
  onClose,
  batch,
  onEventAdded,
}: RecordEventModalProps) {
  const { accountId, isConnected } = useWallet();
  const [eventType, setEventType] = useState<SupplyChainEventType>("COLD_STORAGE_DEPOSIT");
  const [title, setTitle] = useState("Cold Chain Intake & Pre-Cooling");
  const [location, setLocation] = useState("Lagos Central ColdHubs Terminal");
  const [facilityName, setFacilityName] = useState("ColdHubs Enterprise Facility #09");
  const [actorAccount, setActorAccount] = useState(
    isConnected && accountId ? accountId : "logistics-officer.near"
  );
  const [actorRole, setActorRole] = useState("Cold Chain Operations Manager");
  const [tempSnapshot, setTempSnapshot] = useState(12.4);
  const [humiditySnapshot, setHumiditySnapshot] = useState(82);
  const [notes, setNotes] = useState("Produce transferred into controlled-atmosphere cooling. Temperature maintained within ±0.5°C.");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && accountId) {
      setActorAccount(accountId);
    }
  }, [isConnected, accountId]);

  if (!isOpen) return null;

  const eventOptions: { type: SupplyChainEventType; defaultTitle: string; defaultRole: string }[] = [
    { type: "COLD_STORAGE_DEPOSIT", defaultTitle: "Cold Chain Storage Intake", defaultRole: "Cold Chain Officer" },
    { type: "QUALITY_AUDIT_PASSED", defaultTitle: "PwC & GlobalG.A.P. Export Audit Passed", defaultRole: "Accredited Quality Auditor" },
    { type: "LOGISTICS_DISPATCH", defaultTitle: "Smart Fleet Dispatch & Reefer Seal", defaultRole: "Fleet Telematics Supervisor" },
    { type: "PORT_CUSTOMS_CLEARANCE", defaultTitle: "Phytosanitary & Port Customs Release", defaultRole: "Customs Clearance Officer" },
    { type: "DISTRIBUTION_CENTER_RECEIPT", defaultTitle: "Distribution Hub Ingestion", defaultRole: "Logistics Hub Director" },
    { type: "SUPERMARKET_DELIVERY", defaultTitle: "Retail Supermarket Verification & Shelf Placement", defaultRole: "Store Quality Manager" },
  ];

  const handleSelectEventType = (type: SupplyChainEventType) => {
    setEventType(type);
    const found = eventOptions.find((o) => o.type === type);
    if (found) {
      setTitle(found.defaultTitle);
      setActorRole(found.defaultRole);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: batch.id,
          eventType,
          title,
          location,
          facilityName,
          actorAccount,
          actorRole,
          notes,
          temperatureSnapshot: tempSnapshot,
          humiditySnapshot,
        }),
      });

      const data = await res.json();
      if (data.success && data.event) {
        onEventAdded(data.event);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white shadow-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <GitFork className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Record Supply Chain Milestone
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Batch: {batch.batchNumber} ({batch.cropName.split(" (")[0]})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Supply Chain Milestone Stage
            </label>
            <select
              value={eventType}
              onChange={(e) => handleSelectEventType(e.target.value as SupplyChainEventType)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            >
              {eventOptions.map((opt) => (
                <option key={opt.type} value={opt.type}>
                  {opt.defaultTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Event Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Facility Name</label>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Geographic Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Signing NEAR Account</label>
              <input
                type="text"
                value={actorAccount}
                onChange={(e) => setActorAccount(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-emerald-800 font-mono font-semibold focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Cold-Chain Telemetry Snapshot */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-3">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5 text-emerald-600" />
              Cold-Chain Telemetry Snapshot at Handoff
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1 font-semibold">Core Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={tempSnapshot}
                  onChange={(e) => setTempSnapshot(Number(e.target.value))}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 font-mono focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1 font-semibold">Relative Humidity (% RH)</label>
                <input
                  type="number"
                  value={humiditySnapshot}
                  onChange={(e) => setHumiditySnapshot(Number(e.target.value))}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 font-mono focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Operational Notes & Audit Remarks</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs disabled:opacity-50 transition-all"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{loading ? "Recording on NEAR..." : "Commit Milestone to NEAR"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
