"use client";

import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Sparkles, 
  Leaf, 
  Droplet, 
  Zap, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { PWC_AGRIBUSINESS_METRICS } from "@/lib/mockData";
import { AgribusinessMetric, FarmLocation } from "@/lib/types";

interface PwCAgriInsightsProps {
  selectedFarm: FarmLocation;
}

export function PwCAgriInsights({ selectedFarm }: PwCAgriInsightsProps) {
  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-teal-950/40 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                PwC AGRIBUSINESS ALIGNMENT
              </span>
              <span className="text-xs text-slate-400">Research Benchmark 2020-2026</span>
            </div>
            <h2 className="mt-2 text-xl font-extrabold text-white tracking-wide">
              Enterprise Value-Chain Productivity & ESG Impact
            </h2>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              Addressing post-harvest losses, micro-irrigation productivity bottlenecks, and on-chain export compliance outlined in PwC Nigeria&apos;s landmark agribusiness report: <em>&quot;Unlocking productivity and investment opportunities across Nigeria&apos;s agribusiness value-chain.&quot;</em>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.pwc.com/ng/en/assets/pdf/unlocking-investment-opportunities-in-agribusiness.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors border border-white/10"
            >
              <FileText className="h-4 w-4 text-emerald-400" />
              <span>Read PwC Report</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PWC_AGRIBUSINESS_METRICS.map((metric, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-5 shadow-xl backdrop-blur-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {metric.title}
              </span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {metric.value}
              </span>
              <span className="text-xs font-semibold text-emerald-400 font-mono">
                {metric.change}
              </span>
            </div>

            <div className="text-[11px] font-semibold text-cyan-300 font-mono bg-cyan-950/40 rounded-lg p-1.5 border border-cyan-500/20">
              {metric.pwcBenchmark}
            </div>

            <p className="text-xs text-slate-400 leading-snug">
              {metric.description}
            </p>
          </div>
        ))}
      </div>

      {/* AI Agronomic Advisory & Value Chain Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agronomic Recommendations */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              AI Agronomic Recommendations (Sector: {selectedFarm.name})
            </h3>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">Moisture Depletion Forecast</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">HIGH CONFIDENCE (96%)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Diurnal soil temperature curve indicates peak evapotranspiration between 13:00 - 15:30. Recommend pre-emptive micro-irrigation pulse at 11:30 to avoid root thermal shock.
              </p>
            </div>

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">Vapor Pressure Deficit (VPD) Optimization</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">OPTIMAL (1.18 kPa)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Stomatal conductance is currently within maximum photosynthetic efficiency window for {selectedFarm.cropType.split(" (")[0]}. Nutrient uptake rate is 14% higher than baseline.
              </p>
            </div>

            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300">Harvest Window Readiness</span>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">ESTIMATED: 5 DAYS</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Soil moisture stress index remaining under 0.08 indicates uniform fruit firmness suitable for long-haul reefer transit to export hubs.
              </p>
            </div>
          </div>
        </div>

        {/* Post-Harvest Loss Mitigation */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <ShieldCheck className="h-5 w-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">
              PwC Agribusiness Value-Chain Strategy
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="rounded-xl bg-black/40 p-3.5 border border-white/5 space-y-1.5">
              <h4 className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Target 1: Combating Perishable Produce Losses (Tomatoes & Veg)
              </h4>
              <p className="text-slate-400 leading-relaxed">
                PwC Nigeria notes that up to 45% of fresh horticultural crops are lost between field and retail due to lack of cold storage and delayed transport. FARMATRIX integrates real-time ColdHubs telemetry directly with immutable NEAR dispatch records.
              </p>
            </div>

            <div className="rounded-xl bg-black/40 p-3.5 border border-white/5 space-y-1.5">
              <h4 className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Target 2: Farmer Financial Inclusion & Premium Pricing
              </h4>
              <p className="text-slate-400 leading-relaxed">
                By committing moisture-calibrated harvest metrics to NEAR smart contracts, smallholder clusters establish verified provenance, qualifying for institutional agro-financing and capturing export price premiums.
              </p>
            </div>

            <div className="rounded-xl bg-black/40 p-3.5 border border-white/5 space-y-1.5">
              <h4 className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Target 3: Sustainable Water Resource Management
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Automated capacitive soil sensing limits water extraction strictly to crop demand thresholds, saving an average of 38.4% water and preventing fertilizer runoff into local water tables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
