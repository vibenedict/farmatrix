"use client";

import React, { useState } from "react";
import { ScreenId } from "@/components/Layout/FarmChainHeader";
import { ShieldCheck, Plus, ExternalLink, Sparkles, Check, Sprout } from "lucide-react";

interface BatchItem {
  id: string;
  crop: string;
  mass: string;
  txHash: string;
  status: "NEAR Verified" | "Contract Syncing";
  image: string;
}

const INITIAL_BATCH_CARDS: BatchItem[] = [
  {
    id: "#FC-AVO-2026-88",
    crop: "Hass Avocados",
    mass: "1,250 kg",
    txHash: "0x9f3k2a...89a1",
    status: "NEAR Verified",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "#FC-TOM-2026-42",
    crop: "Roma Tomatoes",
    mass: "3,400 kg",
    txHash: "0x4b7c1e...62f9",
    status: "NEAR Verified",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "#FC-CIT-2026-19",
    crop: "Valencia Oranges",
    mass: "2,100 kg",
    txHash: "0x1d8a39...45bc",
    status: "Contract Syncing",
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "#FC-WHT-2026-91",
    crop: "Organic Grain",
    mass: "8,500 kg",
    txHash: "0x7e2f50...10da",
    status: "NEAR Verified",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
  },
];

interface TraceabilityViewProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectBatch?: (batchId: string) => void;
}

export function TraceabilityView({ onNavigate, onSelectBatch }: TraceabilityViewProps) {
  const [batches, setBatches] = useState<BatchItem[]>(INITIAL_BATCH_CARDS);
  const [cropInput, setCropInput] = useState("Organic Hass Avocado");
  const [massInput, setMassInput] = useState("1250");
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccessMsg, setMintSuccessMsg] = useState<string | null>(null);

  const handleMintBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMinting(true);

    setTimeout(() => {
      const randomSuffix = Math.floor(10 + Math.random() * 90);
      const batchCode = cropInput.toLowerCase().includes("avo")
        ? "AVO"
        : cropInput.toLowerCase().includes("tom")
        ? "TOM"
        : "CRP";
      const newBatchId = `#FC-${batchCode}-2026-${randomSuffix}`;
      const randomHash = `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`;

      const newBatch: BatchItem = {
        id: newBatchId,
        crop: cropInput,
        mass: `${Number(massInput).toLocaleString()} kg`,
        txHash: randomHash,
        status: "NEAR Verified",
        image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=400&q=80",
      };

      setBatches([newBatch, ...batches]);
      setIsMinting(false);
      setMintSuccessMsg(`Batch ${newBatchId} minted! Tx: ${randomHash}`);

      setTimeout(() => setMintSuccessMsg(null), 5000);
    }, 1200);
  };

  const handleViewPortal = (batchId: string) => {
    if (onSelectBatch) {
      onSelectBatch(batchId);
    }
    onNavigate("consumer");
  };

  return (
    <section id="screen-traceability" className="screen-view relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Bar */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-enterprise-glassBorder">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              NEAR Protocol Smart Contract Batch Ledger
            </h2>
            <p className="text-xs text-enterprise-textSecondary mt-1">
              Mint immutable agricultural provenance records directly to NEAR Protocol Mainnet.
            </p>
          </div>
          
          <span className="px-4 py-2 rounded-xl bg-enterprise-near/20 text-indigo-300 border border-enterprise-near/30 text-xs font-mono font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-enterprise-near animate-pulse" />
            Contract: trace.farmchain.near
          </span>
        </div>

        {/* Active Batches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {batches.slice(0, 4).map((b) => (
            <div
              key={b.id}
              className="glass-panel rounded-2xl overflow-hidden border border-enterprise-glassBorder flex flex-col justify-between"
            >
              <div className="h-28 w-full relative overflow-hidden bg-gradient-to-br from-emerald-950 via-enterprise-surfaceCard to-enterprise-void flex items-center justify-center">
                <img
                  src={b.image}
                  alt={b.crop}
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    // graceful fallback if offline
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-enterprise-surfaceCard/90 via-transparent to-transparent pointer-events-none" />
                <Sprout className="w-8 h-8 text-enterprise-accent/30 absolute" />
              </div>

              <div className="p-3.5 text-xs space-y-1">
                <p className="font-bold text-white">{b.id}</p>
                <p className="text-[10px] text-enterprise-textSecondary font-mono">
                  {b.crop} • {b.mass}
                </p>
                <span
                  className={`mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                    b.status === "NEAR Verified"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Batch Mint Form */}
          <div className="glass-panel p-6 rounded-3xl space-y-5 border border-enterprise-glassBorder">
            <h3 className="font-bold text-white text-lg border-b border-enterprise-glassBorder pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-enterprise-near" />
              Mint Harvest Batch
            </h3>

            {mintSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{mintSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleMintBatch} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-enterprise-textSecondary block mb-1">
                  Crop Variety
                </label>
                <input
                  type="text"
                  required
                  value={cropInput}
                  onChange={(e) => setCropInput(e.target.value)}
                  className="w-full p-3 rounded-xl glass-input text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-enterprise-textSecondary block mb-1">
                  Harvest Mass (kg)
                </label>
                <input
                  type="number"
                  required
                  value={massInput}
                  onChange={(e) => setMassInput(e.target.value)}
                  className="w-full p-3 rounded-xl glass-input text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-enterprise-textSecondary block mb-1">
                  Origin Zone
                </label>
                <input
                  type="text"
                  value="Salinas Valley Sector 4"
                  disabled
                  className="w-full p-3 rounded-xl glass-input text-enterprise-textSecondary font-mono opacity-80 cursor-not-allowed"
                />
              </div>

              <div className="p-4 rounded-xl bg-enterprise-void/60 border border-enterprise-glassBorder space-y-1.5 text-enterprise-textSecondary font-mono">
                <div className="flex justify-between">
                  <span>Telemetry Moisture Avg:</span>
                  <strong className="text-enterprise-accent">52% Avg</strong>
                </div>
                <div className="flex justify-between">
                  <span>Temp Bounds:</span>
                  <strong className="text-white">18.2 - 29.5°C</strong>
                </div>
                <div className="flex justify-between">
                  <span>Gas Fee:</span>
                  <strong className="text-indigo-300">~0.0008 NEAR</strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={isMinting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-enterprise-near to-indigo-600 text-white font-extrabold text-xs shadow-glow-near hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isMinting ? (
                  <span>SUBMITTING IMMUTABLE TRANSACTION...</span>
                ) : (
                  <span>MINT BATCH ON NEAR MAINNET</span>
                )}
              </button>
            </form>
          </div>

          {/* On-Chain Registry Audit Table */}
          <div className="lg:col-span-2 glass-panel rounded-3xl border border-enterprise-glassBorder overflow-hidden flex flex-col">
            <div className="p-6 border-b border-enterprise-glassBorder flex items-center justify-between">
              <h3 className="font-bold text-white text-lg">On-Chain Batch Provenance Registry</h3>
              <span className="text-xs text-enterprise-textSecondary font-mono">
                Showing verified mainnet blocks
              </span>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-enterprise-void/80 text-enterprise-textSecondary font-bold uppercase border-b border-enterprise-glassBorder">
                    <th className="p-4">Batch ID</th>
                    <th className="p-4">Crop Variety</th>
                    <th className="p-4">Mass</th>
                    <th className="p-4">NEAR Tx Hash</th>
                    <th className="p-4 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody id="blockchainTableBody" className="divide-y divide-enterprise-glassBorder font-medium">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-enterprise-surface/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-enterprise-mint">{batch.id}</td>
                      <td className="p-4 text-gray-200">{batch.crop}</td>
                      <td className="p-4 text-gray-200">{batch.mass}</td>
                      <td className="p-4 font-mono text-indigo-300">{batch.txHash}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleViewPortal(batch.id)}
                          className="text-enterprise-accent hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>View Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
