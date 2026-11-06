import { farmatrixStore } from "@/lib/store";
import { VerificationPortal } from "@/components/Verification/VerificationPortal";
import Link from "next/link";
import { Sprout, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ batchId: string }>;
}

export default async function VerifyBatchPage({ params }: PageProps) {
  const resolvedParams = await params;
  const batchId = decodeURIComponent(resolvedParams.batchId);

  const found = farmatrixStore.batches.find(
    (b) => b.id === batchId || b.batchNumber.toLowerCase() === batchId.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-[#070a12] text-white p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto flex items-center justify-between pb-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to FARMATRIX Platform</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-sm font-mono tracking-wider">FARMATRIX VERIFIED</span>
        </div>
      </div>

      <VerificationPortal
        initialBatch={found || null}
        allBatches={farmatrixStore.batches}
      />
    </main>
  );
}
