import { farmatrixStore } from "@/lib/store";
import { VerificationPortal } from "@/components/Verification/VerificationPortal";
import Link from "next/link";
import { Sprout, ArrowLeft } from "lucide-react";

export default function VerifyGeneralPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto flex items-center justify-between pb-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
          <span>Back to FARMATRIX Platform</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-sm font-mono tracking-wider text-slate-900">FARMATRIX VERIFIED</span>
        </div>
      </div>

      <VerificationPortal
        initialBatch={farmatrixStore.batches[0] || null}
        allBatches={farmatrixStore.batches}
      />
    </main>
  );
}
