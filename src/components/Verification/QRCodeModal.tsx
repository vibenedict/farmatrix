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
          dark: "#0f172a",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 text-center">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-left">
            <QrCode className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cryptographic Verification QR</h3>
              <p className="text-[11px] text-slate-500">Batch: {batch.batchNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* QR Card */}
        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 p-6 shadow-inner">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code for batch ${batch.batchNumber}`}
              className="h-56 w-56 object-contain rounded-lg border border-slate-200 shadow-2xs"
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
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 py-2 px-3 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copied ? "Copied Link!" : "Copy URL"}</span>
            </button>

            <button
              onClick={handleDownloadQR}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 py-2 px-3 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span>Download Label</span>
            </button>
          </div>

          <Link
            href={`/verify/${batch.batchNumber}`}
            target="_blank"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 px-4 text-xs font-bold text-white shadow-xs transition-all"
          >
            <span>Open Consumer Verification Portal</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
