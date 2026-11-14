"use client";

import React, { useState } from "react";
import { 
  Check, 
  ShieldCheck, 
  Droplets, 
  Thermometer, 
  QrCode, 
  ExternalLink,
  MapPin,
  Calendar,
  Share2,
  Sprout
} from "lucide-react";

interface ConsumerVerificationViewProps {
  batchId?: string;
  cropName?: string;
  producer?: string;
  location?: string;
  moistureAvg?: string;
  tempBounds?: string;
  txHash?: string;
}

export function ConsumerVerificationView({
  batchId = "#FC-AVO-2026-88",
  cropName = "Organic Hass Avocados",
  producer = "Green Valley Organics",
  location = "Salinas Valley, CA",
  moistureAvg = "52% (Optimal)",
  tempBounds = "18.2 - 29.5°C",
  txHash = "0x9f3k2a71d80b62e4...89a1",
}: ConsumerVerificationViewProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="screen-consumer" className="screen-view relative z-10 py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Verification Card */}
        <div className="glass-panel rounded-3xl border border-enterprise-accent/30 overflow-hidden shadow-2xl">
          
          {/* Verified Image Header */}
          <div className="h-56 relative overflow-hidden bg-gradient-to-br from-emerald-950 via-enterprise-surfaceCard to-enterprise-void flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80"
              alt="Verified Produce"
              loading="eager"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <Sprout className="w-16 h-16 text-enterprise-accent/30 absolute" />
            <div className="absolute inset-0 bg-gradient-to-t from-enterprise-surfaceCard via-enterprise-surfaceCard/40 to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-enterprise-accent text-enterprise-void shadow-glow-emerald backdrop-blur-md">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>VERIFIED ON NEAR</span>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-enterprise-void/80 text-white font-mono backdrop-blur-md border border-white/10">
                {batchId}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6 -mt-8 relative z-10">
            <div className="text-center space-y-1">
              <h2 className="text-3xl font-black text-white tracking-tight">{cropName}</h2>
              <p className="text-xs text-enterprise-mint font-mono flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-enterprise-accent" />
                <span>Producer: {producer} ({location})</span>
              </p>
            </div>

            {/* Cryptographic Proof Box */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-enterprise-textSecondary">
                Cryptographic Proof Receipt
              </h4>
              <div className="p-4 rounded-2xl bg-enterprise-void/80 border border-enterprise-near/40 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-enterprise-textSecondary">Network:</span>
                  <strong className="text-white">NEAR Mainnet</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-enterprise-textSecondary">Smart Contract:</span>
                  <strong className="text-indigo-300">trace.farmchain.near</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-enterprise-textSecondary">Block Hash:</span>
                  <strong className="text-indigo-300 truncate max-w-[200px]">{txHash}</strong>
                </div>
              </div>
            </div>

            {/* Growth Climate Baseline Data */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-enterprise-textSecondary">
                Growth Climate Telemetry
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-enterprise-void/60 border border-enterprise-glassBorder">
                  <span className="text-[10px] font-bold text-enterprise-textSecondary uppercase flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-enterprise-accent" />
                    Mean Soil Moisture
                  </span>
                  <p className="text-xl font-extrabold text-enterprise-accent mt-1">
                    {moistureAvg}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-enterprise-void/60 border border-enterprise-glassBorder">
                  <span className="text-[10px] font-bold text-enterprise-textSecondary uppercase flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-amber-400" />
                    Temp Bounds
                  </span>
                  <p className="text-xl font-extrabold text-white mt-1">
                    {tempBounds}
                  </p>
                </div>
              </div>
            </div>

            {/* Chain of Custody Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-enterprise-textSecondary">
                Chain of Custody Timeline
              </h4>
              <div className="space-y-4 pl-3 border-l-2 border-enterprise-accent/40 text-xs">
                <div className="relative pl-5">
                  <div className="absolute -left-[19px] top-0.5 w-3.5 h-3.5 rounded-full bg-enterprise-accent border-2 border-enterprise-void pulse-dot" />
                  <p className="font-bold text-white">Harvested & Minted on NEAR</p>
                  <p className="text-[10px] text-enterprise-textSecondary">
                    Nov 10, 2026 • Salinas Valley Sector 4 (Node #01)
                  </p>
                </div>
                <div className="relative pl-5">
                  <div className="absolute -left-[19px] top-0.5 w-3.5 h-3.5 rounded-full bg-enterprise-accent border-2 border-enterprise-void" />
                  <p className="font-bold text-white">Cold Storage Intake (4.5°C Stabilized)</p>
                  <p className="text-[10px] text-enterprise-textSecondary">
                    Nov 10, 2026 • Regional AgriLogistics Facility #102
                  </p>
                </div>
                <div className="relative pl-5">
                  <div className="absolute -left-[19px] top-0.5 w-3.5 h-3.5 rounded-full bg-enterprise-accent border-2 border-enterprise-void" />
                  <p className="font-bold text-white">Retail Delivery Completed</p>
                  <p className="text-[10px] text-enterprise-textSecondary">
                    Nov 11, 2026 • Whole Foods Market Store #408
                  </p>
                </div>
              </div>
            </div>

            {/* Share / Copy Action */}
            <div className="pt-2 flex gap-3">
              <button
                onClick={handleShare}
                className="w-full py-3 rounded-2xl glass-panel glass-panel-hover text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-enterprise-accent" />
                <span>{copied ? "PORTAL LINK COPIED!" : "SHARE VERIFICATION CERTIFICATE"}</span>
              </button>
            </div>

            <div className="text-center pt-1 border-t border-enterprise-glassBorder">
              <p className="text-[10px] text-enterprise-textSecondary font-mono">
                Verified by FARMATRIX FarmChain Edge Hardware & NEAR Protocol
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
