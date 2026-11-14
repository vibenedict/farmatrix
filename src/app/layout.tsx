import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import { WalletModal } from "@/components/Wallet/WalletModal";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FARMATRIX FarmChain | Enterprise AgriTech & NEAR Blockchain",
  description:
    "Fortune 500 Digital Farming Connected & Traceable. Real-time soil telemetry, automated 5V relay irrigation controls, and tamper-proof product verification on NEAR Protocol.",
  keywords: [
    "FarmChain",
    "FARMATRIX",
    "Enterprise AgriTech",
    "Smart Agriculture",
    "IoT Irrigation",
    "NEAR Blockchain",
    "Supply Chain Traceability",
    "AgriTech",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body
        className={`${jakartaSans.variable} ${geistMono.variable} font-sans antialiased min-h-full bg-enterprise-void text-[#F8FAFC] selection:bg-enterprise-accent selection:text-enterprise-void`}
      >
        <WalletProvider>
          <WalletModal />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
