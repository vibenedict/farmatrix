"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ProductBatch } from "@/lib/types";
import { QrCode, Download, Copy, ExternalLink, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: ProductBatch | null;
}

export function QRCodeModal({ isOpen, onClose, batch }: QRCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (batch && isOpen) {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://farmatrix.agri";
      const verifyUrl = `${origin}/verify/${batch.batchNumber}`;
      QRCode.toDataURL(verifyUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch(console.error);
    }
  }, [batch, isOpen]);

  if (!isOpen || !batch) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const verifyUrl = `${origin}/verify/${batch.batchNumber}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `FARMATRIX-QR-${batch.batchNumber}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900 p-6 shadow-2xl space-y-5 text-center">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-left">
            <QrCode className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Cryptographic Verification QR</h3>
              <p className="text-[11px] text-slate-400">Batch: {batch.batchNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* QR Card */}
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-xl">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code for batch ${batch.batchNumber}`}
              className="h-56 w-56 object-contain"
            />
          ) : (
            <div className="h-56 w-56 flex items-center justify-center text-slate-500 font-mono text-xs">
              Generating Cryptographic QR...
            </div>
          )}

          <div className="mt-4 flex items-center gap-1.5 text-slate-900 font-bold text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>NEAR Blockchain Verified Origin</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            {batch.cropName.split(" (")[0]} • {batch.quantityKg} kg
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-colors"
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied Link!" : "Copy URL"}</span>
            </button>

            <button
              onClick={handleDownloadQR}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Label</span>
            </button>
          </div>

          <Link
            href={`/verify/${batch.batchNumber}`}
            target="_blank"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 px-4 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all"
          >
            <span>Open Consumer Verification Portal</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
