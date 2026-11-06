"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { FarmLocation, CropType, QualityGrade, ProductBatch } from "@/lib/types";
import { Boxes, Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { NEAR_CONFIG } from "@/lib/nearClient";

interface BatchRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  farms: FarmLocation[];
  selectedFarm: FarmLocation;
  onBatchCreated: (batch: ProductBatch) => void;
}

export function BatchRegisterModal({
  isOpen,
  onClose,
  farms,
  selectedFarm,
  onBatchCreated,
}: BatchRegisterModalProps) {
  const [cropName, setCropName] = useState<CropType>(selectedFarm.cropType);
  const [variety, setVariety] = useState("Roma Supreme Export Selection");
  const [quantityKg, setQuantityKg] = useState(2500);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>("Grade A+ (Export Certified)");
  const [farmerNearAccount, setFarmerNearAccount] = useState("kano-valleys.agri.near");
  const [loading, setLoading] = useState(false);
  const [createdBatch, setCreatedBatch] = useState<ProductBatch | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmId: selectedFarm.id,
          farmName: selectedFarm.name,
          cropName,
          variety,
          quantityKg,
          qualityGrade,
          farmerNearAccount,
          soilMoistureAtHarvest: 46.2,
          avgGrowthTemp: 24.8,
          waterEfficiencyIndex: 14.5,
          carbonFootprintKgCO2: 0.17,
        }),
      });

      const data = await res.json();
      if (data.success && data.batch) {
        setCreatedBatch(data.batch);
        onBatchCreated(data.batch);
        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCreatedBatch(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Register Harvest Batch & Mint on NEAR
              </h3>
              <p className="text-xs text-slate-400">
                Facility: {selectedFarm.name} ({selectedFarm.code})
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Success View */}
        {createdBatch ? (
          <div className="space-y-5 text-center py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">
                Harvest Batch Successfully Minted!
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Committed on NEAR Testnet with SHA-256 cryptographic proof
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Batch Identifier:</span>
                <span className="text-white font-bold">{createdBatch.batchNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Crop / Variety:</span>
                <span className="text-slate-200">{createdBatch.cropName.split(" (")[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Certified Quantity:</span>
                <span className="text-emerald-400 font-bold">{createdBatch.quantityKg.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">NEAR Transaction Hash:</span>
                <span className="text-[#00ec97] truncate max-w-[200px]">{createdBatch.blockchainTxHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Data Hash (SHA-256):</span>
                <span className="text-slate-400 truncate max-w-[200px]">{createdBatch.dataHash}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleReset}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 transition-all"
              >
                View Batch in Registry
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Crop Type</label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value as CropType)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Heirloom Tomato (Solanum lycopersicum)">Heirloom Tomato</option>
                  <option value="Yellow Dent Maize (Zea mays)">Yellow Dent Maize</option>
                  <option value="Export Grade Hass Avocado (Persea americana)">Export Hass Avocado</option>
                  <option value="Premium Cocoa (Theobroma cacao)">Premium Cocoa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cultivar / Variety</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Harvested Quantity (kg)</label>
                <input
                  type="number"
                  min="10"
                  max="50000"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Number(e.target.value))}
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Quality Grade</label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Grade A+ (Export Certified)">Grade A+ (Export Certified)</option>
                  <option value="Grade A (Premium Retail)">Grade A (Premium Retail)</option>
                  <option value="Grade B (Processing Quality)">Grade B (Processing Quality)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Authorized NEAR Signer Account
              </label>
              <input
                type="text"
                value={farmerNearAccount}
                onChange={(e) => setFarmerNearAccount(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Smart Contract Commitment Note */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">NEAR Smart Contract Commitment</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Submitting will compute a canonical SHA-256 digest and invoke{" "}
                  <code className="text-[#00ec97] font-mono">register_batch()</code> on the FARMATRIX contract.
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <span>Minting on NEAR Blockchain...</span>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Commit & Mint Batch</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
