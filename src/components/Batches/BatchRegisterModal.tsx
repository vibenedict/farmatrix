"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { FarmLocation, CropType, QualityGrade, ProductBatch } from "@/lib/types";
import { Boxes, Sparkles, ShieldCheck, CheckCircle2, Wallet } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

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
  selectedFarm,
  onBatchCreated,
}: BatchRegisterModalProps) {
  const { accountId, isConnected } = useWallet();
  const [cropName, setCropName] = useState<CropType>(selectedFarm.cropType);
  const [variety, setVariety] = useState("Roma Supreme Export Selection");
  const [quantityKg, setQuantityKg] = useState(2500);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>("Grade A+ (Export Certified)");
  const [farmerNearAccount, setFarmerNearAccount] = useState(
    isConnected && accountId ? accountId : "kano-valleys.agri.near"
  );
  const [loading, setLoading] = useState(false);
  const [createdBatch, setCreatedBatch] = useState<ProductBatch | null>(null);

  useEffect(() => {
    if (isConnected && accountId) {
      setFarmerNearAccount(accountId);
    }
  }, [isConnected, accountId]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Register Harvest Batch & Mint on NEAR
              </h3>
              <p className="text-xs text-slate-500">
                Facility: {selectedFarm.name} ({selectedFarm.code})
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Success View */}
        {createdBatch ? (
          <div className="space-y-5 text-center py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Harvest Batch Successfully Minted!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Committed on NEAR Testnet with SHA-256 cryptographic proof
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Batch Identifier:</span>
                <span className="text-slate-900 font-bold">{createdBatch.batchNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Crop / Variety:</span>
                <span className="text-slate-800">{createdBatch.cropName.split(" (")[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Certified Quantity:</span>
                <span className="text-emerald-700 font-bold">{createdBatch.quantityKg.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">NEAR Transaction Hash:</span>
                <span className="text-emerald-700 truncate max-w-[200px] font-bold">{createdBatch.blockchainTxHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Data Hash (SHA-256):</span>
                <span className="text-slate-600 truncate max-w-[200px]">{createdBatch.dataHash}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleReset}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-xs transition-all"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Crop Type</label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value as CropType)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Heirloom Tomato (Solanum lycopersicum)">Heirloom Tomato</option>
                  <option value="Yellow Dent Maize (Zea mays)">Yellow Dent Maize</option>
                  <option value="Export Grade Hass Avocado (Persea americana)">Export Hass Avocado</option>
                  <option value="Premium Cocoa (Theobroma cacao)">Premium Cocoa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cultivar / Variety</label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Harvested Quantity (kg)</label>
                <input
                  type="number"
                  min="10"
                  max="50000"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Number(e.target.value))}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 font-mono focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quality Grade</label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Grade A+ (Export Certified)">Grade A+ (Export Certified)</option>
                  <option value="Grade A (Premium Retail)">Grade A (Premium Retail)</option>
                  <option value="Grade B (Processing Quality)">Grade B (Processing Quality)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Authorized NEAR Signer Account
              </label>
              <input
                type="text"
                value={farmerNearAccount}
                onChange={(e) => setFarmerNearAccount(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-emerald-800 font-mono font-semibold focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* Smart Contract Commitment Note */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-slate-700 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">NEAR Smart Contract Commitment</div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Submitting will compute a canonical SHA-256 digest and invoke{" "}
                  <code className="text-emerald-700 font-mono font-bold">register_batch()</code> on the FARMATRIX contract.
                </div>
              </div>
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
