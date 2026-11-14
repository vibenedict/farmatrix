"use client";

import React, { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { NEAR_CONFIG } from "@/lib/nearClient";
import { 
  X, 
  Wallet, 
  Check, 
  Copy, 
  ExternalLink, 
  LogOut, 
  Sparkles, 
  ShieldCheck,
  ArrowRight
} from "lucide-react";

export function WalletModal() {
  const { 
    isConnected, 
    accountId, 
    balance, 
    provider, 
    isModalOpen, 
    closeModal, 
    connect, 
    disconnect 
  } = useWallet();

  const [copied, setCopied] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  if (!isModalOpen) return null;

  const handleCopy = () => {
    if (typeof window !== "undefined" && accountId) {
      navigator.clipboard?.writeText(accountId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const formatted = customInput.trim().includes(".")
      ? customInput.trim()
      : `${customInput.trim()}.testnet`;
    connect(formatted, "Custom Wallet");
    setCustomInput("");
    setIsCustomMode(false);
  };

  const walletOptions = [
    {
      id: "mynearwallet",
      name: "MyNearWallet",
      desc: "Official web wallet for NEAR Protocol",
      recommended: true,
      demoAccount: "kano-valleys.agri.near",
      badge: "Official",
    },
    {
      id: "meteor",
      name: "Meteor Wallet",
      desc: "Ecosystem wallet with rich DeFi & NFT support",
      demoAccount: "farmatrix-producer.testnet",
      badge: "Extension / Web",
    },
    {
      id: "here",
      name: "HERE Wallet",
      desc: "Mobile-first non-custodial NEAR wallet",
      demoAccount: "salinas-organics.testnet",
      badge: "Mobile App",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md rounded-3xl glass-panel border border-enterprise-accent/30 shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-enterprise-accent/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-enterprise-glassBorder">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-enterprise-accent to-emerald-700 flex items-center justify-center text-enterprise-void font-bold shadow-glow-emerald">
              <Wallet className="w-5 h-5 text-enterprise-void" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">
                {isConnected ? "Connected NEAR Wallet" : "Connect NEAR Wallet"}
              </h3>
              <p className="text-[11px] text-enterprise-textSecondary">
                NEAR Protocol Testnet • Contract: {NEAR_CONFIG.contractId}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-xl text-enterprise-textSecondary hover:text-white hover:bg-enterprise-surface/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-5 space-y-4">
          {isConnected ? (
            /* Connected View */
            <div className="space-y-4">
              {/* Account Card */}
              <div className="p-4 rounded-2xl bg-enterprise-void/80 border border-enterprise-accent/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-enterprise-accent animate-pulse" />
                    <span className="text-xs font-mono font-bold text-enterprise-mint uppercase">
                      {provider} • Active
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-enterprise-accent/10 text-enterprise-accent border border-enterprise-accent/30">
                    TESTNET
                  </span>
                </div>

                <div>
                  <div className="text-[10px] text-enterprise-textSecondary uppercase tracking-wider font-semibold">
                    NEAR Account ID
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono text-sm font-bold text-white break-all">
                      {accountId}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="ml-2 p-1.5 rounded-lg bg-enterprise-surface hover:bg-enterprise-glassBorder text-enterprise-mint hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                      title="Copy Address"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-enterprise-accent" />
                          <span className="text-enterprise-accent font-mono text-[10px]">Copied</span>
                        </>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Balance display */}
                <div className="pt-2 border-t border-enterprise-glassBorder flex items-center justify-between">
                  <span className="text-xs text-enterprise-textSecondary">Available Balance:</span>
                  <span className="text-base font-extrabold text-enterprise-accent font-mono">
                    Ⓝ {balance}
                  </span>
                </div>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-enterprise-surface/50 border border-enterprise-glassBorder">
                  <div className="text-enterprise-textSecondary text-[10px]">Security</div>
                  <div className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-enterprise-accent" />
                    Ed25519 Keys
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-enterprise-surface/50 border border-enterprise-glassBorder">
                  <div className="text-enterprise-textSecondary text-[10px]">State Proof</div>
                  <div className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3 text-enterprise-mint" />
                    SHA-256 Validated
                  </div>
                </div>
              </div>

              {/* External Explorer Link */}
              <a
                href={`${NEAR_CONFIG.explorerUrl}/accounts/${accountId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl glass-panel hover:bg-enterprise-surface/80 border border-enterprise-glassBorder text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>View Account on NEAR Blocks Explorer</span>
                <ExternalLink className="w-3.5 h-3.5 text-enterprise-accent" />
              </a>

              {/* Disconnect / Switch Button */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-enterprise-surface/60 hover:bg-enterprise-surface border border-enterprise-glassBorder text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Switch Account
                </button>
                <button
                  onClick={disconnect}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-enterprise-rust/10 hover:bg-enterprise-rust/20 border border-enterprise-rust/40 text-enterprise-rust text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>

              {isCustomMode && (
                <form onSubmit={handleCustomSubmit} className="pt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. producer.testnet"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-enterprise-void border border-enterprise-glassBorder text-xs text-white placeholder:text-enterprise-textSecondary focus:border-enterprise-accent outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-enterprise-accent text-enterprise-void font-bold text-xs"
                  >
                    Switch
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Disconnected View: Select Wallet Provider */
            <div className="space-y-3">
              <p className="text-xs text-enterprise-textSecondary">
                Select your preferred NEAR wallet provider to connect your farm account:
              </p>

              {walletOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => connect(opt.demoAccount, opt.name)}
                  className="w-full p-3.5 rounded-2xl glass-panel hover:bg-enterprise-surface/80 border border-enterprise-glassBorder hover:border-enterprise-accent transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-enterprise-void/90 border border-enterprise-glassBorder group-hover:border-enterprise-accent flex items-center justify-center transition-colors">
                      <Wallet className="w-4 h-4 text-enterprise-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-enterprise-accent transition-colors">
                          {opt.name}
                        </span>
                        {opt.recommended && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-enterprise-accent/20 text-enterprise-mint border border-enterprise-accent/30">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-enterprise-textSecondary">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-enterprise-textSecondary group-hover:text-enterprise-accent group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}

              {/* Custom NEAR Account Option */}
              <div className="pt-2">
                {!isCustomMode ? (
                  <button
                    onClick={() => setIsCustomMode(true)}
                    className="w-full py-2 text-center text-xs font-semibold text-enterprise-mint hover:text-white transition-colors cursor-pointer"
                  >
                    + Or connect with custom NEAR Testnet account ID
                  </button>
                ) : (
                  <form onSubmit={handleCustomSubmit} className="space-y-2 pt-2">
                    <label className="text-[11px] font-semibold text-enterprise-textSecondary">
                      Custom NEAR Account ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. my-agri-hub.testnet"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-enterprise-void border border-enterprise-glassBorder text-xs text-white placeholder:text-enterprise-textSecondary focus:border-enterprise-accent outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-enterprise-accent hover:bg-enterprise-accentHover text-enterprise-void font-extrabold text-xs shadow-glow-emerald transition-all cursor-pointer"
                      >
                        Connect
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-enterprise-glassBorder flex items-center justify-between text-[10px] text-enterprise-textSecondary">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-enterprise-accent" />
            <span>NEAR Testnet</span>
          </div>
          <span>farmatrix.testnet</span>
        </div>
      </div>
    </div>
  );
}
