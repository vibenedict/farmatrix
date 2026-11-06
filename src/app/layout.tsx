import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FARMATRIX | Enterprise Smart Agriculture & NEAR Blockchain Platform",
  description:
    "Fortune 500 IoT Agriculture Telemetry, Automated Micro-Irrigation & NEAR Blockchain Tamper-Evident Traceability Platform aligned with PwC Agribusiness benchmarks.",
  keywords: [
    "FARMATRIX",
    "Smart Agriculture",
    "IoT Irrigation",
    "NEAR Blockchain",
    "Supply Chain Traceability",
    "AgriTech",
    "PwC Agribusiness",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#090d16] text-slate-100 selection:bg-emerald-500 selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
