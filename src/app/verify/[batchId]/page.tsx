import { farmatrixStore } from "@/lib/store";
import { ConsumerVerificationView } from "@/components/Views/ConsumerVerificationView";
import { NatureParticlesCanvas } from "@/components/NatureParticlesCanvas";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

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
    <main className="min-h-screen bg-enterprise-void text-[#F8FAFC] p-4 sm:p-8 relative selection:bg-enterprise-accent selection:text-enterprise-void">
      <NatureParticlesCanvas />

      {/* Top Header */}
      <div className="max-w-xl mx-auto flex items-center justify-between pb-6 relative z-10">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-enterprise-glassBorder glass-panel hover:bg-enterprise-surface/50 px-3.5 py-2 text-xs font-semibold text-enterprise-textSecondary hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-enterprise-accent" />
          <span>Back to FARMATRIX Platform</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-enterprise-accent to-emerald-700 text-enterprise-void font-bold shadow-glow-emerald">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-extrabold text-xs font-mono tracking-wider text-white">
            NEAR VERIFIED
          </span>
        </div>
      </div>

      <div className="relative z-10">
        <ConsumerVerificationView
          batchId={found?.batchNumber || batchId}
          cropName={found ? `${found.cropName} (${found.variety})` : "Organic Hass Avocados"}
          producer={found?.farmName || "Green Valley Organics"}
          location="Salinas Valley, CA"
          txHash={found?.blockchainTxHash || "0x9f3k2a71d80b62e4...89a1"}
        />
      </div>
    </main>
  );
}
