"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";

const COUNTRIES = [
  { name: "Bénin", flag: "🇧🇯" },
  { name: "Burkina Faso", flag: "🇧🇫" },
  { name: "Cap-Vert", flag: "🇨🇻" },
  { name: "Côte d'Ivoire", flag: "🇨🇮" },
  { name: "Gambie", flag: "🇬🇲" },
  { name: "Ghana", flag: "🇬🇭" },
  { name: "Guinée", flag: "🇬🇳" },
  { name: "Guinée-Bissau", flag: "🇬🇼" },
  { name: "Liberia", flag: "🇱🇷" },
  { name: "Mali", flag: "🇲🇱" },
  { name: "Mauritanie", flag: "🇲🇷" },
  { name: "Niger", flag: "🇳🇪" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "Sénégal", flag: "🇸🇳" },
  { name: "Sierra Leone", flag: "🇸🇱" },
  { name: "Togo", flag: "🇹🇬" },
  { name: "Autre", flag: "🌍" },
];

export default function ShippingSelector() {
  const { country, setCountry, shippingOptions, selectedShipping, setSelectedShipping } = useCart() as any;
  const { convertirPrix, symboleDevise } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentCountryObj = COUNTRIES.find((c) => c.name === country) || COUNTRIES[0];

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200/80 space-y-3 shadow-2xs relative">
      <div>
        <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase block mb-1 font-semibold">Pays de livraison</label>
        
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-xs font-sans bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-[#E88D9E] transition shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base">{currentCountryObj.flag}</span>
            <span className="font-semibold text-[#2C2224]">{currentCountryObj.name}</span>
          </div>
          <span className={`text-gray-400 text-[10px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▼</span>
        </div>

        {isOpen && (
          <div className="absolute left-4 right-4 top-20 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden py-2 max-h-60 overflow-y-auto">
            {COUNTRIES.map((c) => (
              <div
                key={c.name}
                onClick={() => {
                  setCountry(c.name);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-xs flex items-center gap-3 cursor-pointer transition ${
                  country === c.name ? "bg-[#E88D9E]/10 font-bold text-[#2C2224]" : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span className="text-base">{c.flag}</span>
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase block mb-1 font-semibold">Mode de livraison</label>
        <div className="space-y-2">
          {shippingOptions.map((opt: any) => (
            <div
              key={opt.id}
              onClick={() => setSelectedShipping(opt)}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition flex justify-between items-center ${
                selectedShipping?.id === opt.id ? "border-[#E88D9E] bg-[#E88D9E]/5 font-semibold" : "border-gray-200 bg-gray-50/50"
              }`}
            >
              <div className="pr-2 text-[10px]">
                <span className="block text-[#2C2224]">{opt.name}</span>
                <span className="text-gray-400">{opt.description}</span>
              </div>
              <span className="font-mono font-bold text-[#2C2224]">{convertirPrix(opt.price).toLocaleString()} {symboleDevise}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
