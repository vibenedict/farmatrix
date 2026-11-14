"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { NEAR_CONFIG } from "@/lib/nearClient";

interface WalletContextType {
  isConnected: boolean;
  accountId: string;
  balance: string;
  provider: string;
  network: string;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  connect: (accountId?: string, provider?: string) => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const STORAGE_KEY = "farmatrix_near_wallet";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [accountId, setAccountId] = useState<string>("kano-valleys.agri.near");
  const [balance, setBalance] = useState<string>("48.25 NEAR");
  const [provider, setProvider] = useState<string>("MyNearWallet");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isConnected && parsed.accountId) {
          setIsConnected(true);
          setAccountId(parsed.accountId);
          setBalance(parsed.balance || "48.25 NEAR");
          setProvider(parsed.provider || "MyNearWallet");
        }
      }
    } catch {
      // ignore localStorage parse error
    }
  }, []);

  const connect = (
    newAccountId: string = "kano-valleys.agri.near",
    newProvider: string = "MyNearWallet"
  ) => {
    setIsConnected(true);
    setAccountId(newAccountId);
    setProvider(newProvider);
    const mockBalance = (Math.random() * 30 + 20).toFixed(2) + " NEAR";
    setBalance(mockBalance);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isConnected: true,
          accountId: newAccountId,
          balance: mockBalance,
          provider: newProvider,
        })
      );
    } catch {
      // ignore storage write errors
    }
    setIsModalOpen(false);
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccountId("");
    setBalance("0.00 NEAR");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        accountId,
        balance,
        provider,
        network: NEAR_CONFIG.networkId,
        isModalOpen,
        openModal: () => setIsModalOpen(true),
        closeModal: () => setIsModalOpen(false),
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
