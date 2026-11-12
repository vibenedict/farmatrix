"use client";

import React, { useState } from "react";
import { ScreenId } from "@/components/Layout/FarmChainHeader";
import { Plus, X, Check, MapPin, Cpu, Droplets } from "lucide-react";

interface ZoneData {
  id: string;
  name: string;
  cropDescription: string;
  cropVariety: string;
  soilType: string;
  hardwareNode: string;
  soilMoisture: string;
  status: "Optimal" | "Attention" | "Protected";
  imageUrl: string;
}

const INITIAL_ZONES: ZoneData[] = [
  {
    id: "ZONE #A1",
    name: "Salinas Valley Sector 4",
    cropDescription: "Organic Hass Avocado Plantation",
    cropVariety: "Hass Avocado",
    soilType: "Rich Loam Soil",
    hardwareNode: "Arduino UNO #01",
    soilMoisture: "34% (Low Alert)",
    status: "Optimal",
    imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ZONE #B2",
    name: "Central Acre Tomatoes",
    cropDescription: "Precision Vine Tomatoes",
    cropVariety: "Roma Tomatoes",
    soilType: "Sandy Clay",
    hardwareNode: "Arduino Nano #04",
    soilMoisture: "28% (Dry Soil)",
    status: "Attention",
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ZONE #C3",
    name: "Greenhouse Hydro Berries",
    cropDescription: "Vertical Strawberry Farming",
    cropVariety: "Organic Strawberries",
    soilType: "Peat Moss Mix",
    hardwareNode: "ESP32 Node #09",
    soilMoisture: "58% (Balanced)",
    status: "Protected",
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
  },
];

interface FarmFleetViewProps {
  onNavigate: (screen: ScreenId) => void;
}

export function FarmFleetView({ onNavigate }: FarmFleetViewProps) {
  const [zones, setZones] = useState<ZoneData[]>(INITIAL_ZONES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  const [newCrop, setNewCrop] = useState("Valencia Oranges");
  const [newSoil, setNewSoil] = useState("Clay Loam");
  const [newNode, setNewNode] = useState("Arduino UNO #05");

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName) return;

    const newZone: ZoneData = {
      id: `ZONE #D${zones.length + 1}`,
      name: newZoneName,
      cropDescription: `${newCrop} Plantation`,
      cropVariety: newCrop,
      soilType: newSoil,
      hardwareNode: newNode,
      soilMoisture: "50% (Baseline)",
      status: "Optimal",
      imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80",
    };

    setZones([...zones, newZone]);
    setNewZoneName("");
    setIsAddModalOpen(false);
  };

  return (
    <section id="screen-farms" className="screen-view relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Bar */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-enterprise-glassBorder">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Farm Fleet & Crop Allocations
            </h2>
            <p className="text-xs text-enterprise-textSecondary mt-1">
              Multi-zone telemetry management across regional fields and greenhouses.
            </p>
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-enterprise-accent hover:bg-emerald-500 text-enterprise-void font-extrabold text-xs shadow-glow-emerald flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NEW ZONE</span>
          </button>
        </div>

        {/* Zone Fleet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-enterprise-glassBorder flex flex-col justify-between"
            >
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img
                    src={zone.imageUrl}
                    alt={zone.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-enterprise-surfaceCard via-transparent to-black/30" />
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-enterprise-accent bg-enterprise-void/80 px-2.5 py-1 rounded-full font-mono border border-enterprise-accent/30">
                      {zone.id}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold border backdrop-blur-md uppercase ${
                        zone.status === "Optimal"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : zone.status === "Attention"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                      }`}
                    >
                      {zone.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{zone.name}</h3>
                    <p className="text-xs text-enterprise-textSecondary">{zone.cropDescription}</p>
                  </div>

                  <div className="space-y-2 text-xs border-y border-enterprise-glassBorder py-4 text-enterprise-textSecondary">
                    <div className="flex justify-between">
                      <span>Crop Variety:</span>
                      <strong className="text-white">{zone.cropVariety}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Soil Type:</span>
                      <strong className="text-white">{zone.soilType}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Hardware Node:</span>
                      <strong className="text-enterprise-accent font-mono">{zone.hardwareNode}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Soil Moisture:</span>
                      <strong
                        className={`font-bold ${
                          zone.soilMoisture.includes("Low") || zone.soilMoisture.includes("Dry")
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {zone.soilMoisture}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => onNavigate("irrigation")}
                  className="w-full py-3 rounded-2xl glass-panel glass-panel-hover text-white text-xs font-bold transition-all cursor-pointer"
                >
                  CONFIGURE IRRIGATION
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Add New Zone Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-enterprise-accent/30 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-enterprise-glassBorder pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-enterprise-accent" />
                Add New Farm Zone
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateZone} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-enterprise-textSecondary block mb-1">
                  Zone Sector Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. San Joaquin Orchard #07"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="w-full p-3 rounded-xl glass-input text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-enterprise-textSecondary block mb-1">
                  Crop Variety
                </label>
                <input
                  type="text"
                  required
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full p-3 rounded-xl glass-input text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-enterprise-textSecondary block mb-1">
                  Soil / Substrate Type
                </label>
                <input
                  type="text"
                  required
                  value={newSoil}
                  onChange={(e) => setNewSoil(e.target.value)}
                  className="w-full p-3 rounded-xl glass-input text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-enterprise-textSecondary block mb-1">
                  Assigned Hardware Node
                </label>
                <input
                  type="text"
                  required
                  value={newNode}
                  onChange={(e) => setNewNode(e.target.value)}
                  className="w-full p-3 rounded-xl glass-input text-white font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl glass-panel text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-enterprise-accent hover:bg-emerald-500 text-enterprise-void font-extrabold shadow-glow-emerald"
                >
                  Create Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
