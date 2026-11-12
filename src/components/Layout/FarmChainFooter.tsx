"use client";

import React from "react";

export function FarmChainFooter() {
  return (
    <footer className="glass-panel border-t border-enterprise-glassBorder py-6 mt-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-enterprise-textSecondary">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white uppercase tracking-wider">
            FARMATRIX FarmChain Enterprise
          </span>
          <span>© 2026 Smart Agriculture & Traceability Platform</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono text-[11px]">
          <span className="text-indigo-300">NEAR Protocol Mainnet</span>
          <span className="text-enterprise-glassBorder">•</span>
          <span className="text-emerald-400">Arduino Serial USB: Active</span>
          <span className="text-enterprise-glassBorder">•</span>
          <span className="text-enterprise-mint">Edge Telemetry Sync: OK</span>
        </div>
      </div>
    </footer>
  );
}
