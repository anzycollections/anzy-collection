"use client";

import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { useState, useRef, useEffect } from "react";

export default function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const { items } = useCart();
  const { langue, setLangue, devise, setDevise } = useStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const [langOpen, setLangOpen] = useState(false);
  const [deviseOpen, setDeviseOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const deviseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
      if (deviseRef.current && !deviseRef.current.contains(event.target as Node)) {
        setDeviseOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F5]/95 backdrop-blur-md border-b border-[#E88D9E]/15">
      {/* Ligne principale : Logo réduit et centré, Panier à droite */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between relative">
        <div className="w-10 hidden sm:block" />

        <div className="text-center absolute left-1/2 -translate-x-1/2">
          <a href="/" className="block">
            <h1 className="text-sm sm:text-base font-serif font-bold tracking-[0.2em] text-[#2C2224] uppercase whitespace-nowrap">
              ANZY COLLECTION
            </h1>
            <span className="text-[7px] sm:text-[8px] font-mono tracking-[0.25em] text-[#E88D9E] uppercase block">
              MAISON DE BEAUTÉ & GAINES
            </span>
          </a>
        </div>

        <div className="ml-auto flex items-center">
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-2xl bg-[#2C2224] text-white hover:bg-[#E88D9E] transition-all duration-300 shadow-md cursor-pointer"
            aria-label="Panier"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E88D9E] text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Ligne séparatrice */}
      <div className="w-full border-t border-[#E88D9E]/10" />

      {/* Sous-ligne : Langue à gauche, Devise à droite */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between">
        
        {/* Sélecteur de Langue (Gauche) */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200 shadow-2xs text-xs font-medium text-[#2C2224] hover:border-[#E88D9E] transition cursor-pointer"
          >
            <span className="text-sm">🇫🇷</span>
            <span className="font-mono font-bold">{langue}</span>
            <span className={`text-[9px] text-gray-400 transition-transform ${langOpen ? "rotate-180" : ""}`}>▼</span>
          </button>

          {langOpen && (
            <div className="absolute left-0 mt-2 w-28 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 py-1">
              <button
                onClick={() => { setLangue("FR"); setLangOpen(false); }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50 ${langue === "FR" ? "font-bold text-[#E88D9E]" : "text-gray-700"}`}
              >
                <span>🇫🇷</span> FR
              </button>
              <button
                onClick={() => { setLangue("EN"); setLangOpen(false); }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50 ${langue === "EN" ? "font-bold text-[#E88D9E]" : "text-gray-700"}`}
              >
                <span>🇬🇧</span> EN
              </button>
            </div>
          )}
        </div>

        {/* Sélecteur de Devise (Droite) */}
        <div className="relative" ref={deviseRef}>
          <button
            onClick={() => setDeviseOpen(!deviseOpen)}
            className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200 shadow-2xs text-xs font-medium text-[#2C2224] hover:border-[#E88D9E] transition cursor-pointer"
          >
            <span className="font-mono font-bold">{devise === "XOF" ? "F CFA" : devise}</span>
            <span className={`text-[9px] text-gray-400 transition-transform ${deviseOpen ? "rotate-180" : ""}`}>▼</span>
          </button>

          {deviseOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 py-1">
              <button
                onClick={() => { setDevise("XOF"); setDeviseOpen(false); }}
                className={`w-full px-3 py-2 text-left text-xs font-mono ${devise === "XOF" ? "font-bold text-[#E88D9E]" : "text-gray-700"} hover:bg-gray-50`}
              >
                F CFA
              </button>
              <button
                onClick={() => { setDevise("EUR"); setDeviseOpen(false); }}
                className={`w-full px-3 py-2 text-left text-xs font-mono ${devise === "EUR" ? "font-bold text-[#E88D9E]" : "text-gray-700"} hover:bg-gray-50`}
              >
                EUR (€)
              </button>
              <button
                onClick={() => { setDevise("USD"); setDeviseOpen(false); }}
                className={`w-full px-3 py-2 text-left text-xs font-mono ${devise === "USD" ? "font-bold text-[#E88D9E]" : "text-gray-700"} hover:bg-gray-50`}
              >
                USD ($)
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
