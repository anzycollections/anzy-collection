"use client";

import { useState } from "react";
import { useStore, Langue, Devise } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";

interface HeaderProps {
  onOpenCart: () => void; // 👈 Plus de '?' ! On oblige le parent à fournir la fonction.
}

export default function Header({ onOpenCart }: HeaderProps) {
  const { devise, setDevise, langue, setLangue } = useStore();
  const { totalItems } = useCart(); 
  
  // État pour gérer l'ouverture de nos menus personnalisés
  const [openDropdown, setOpenDropdown] = useState<"langue" | "devise" | null>(null);

  const langOptions = [
    { code: "FR", label: "🇫🇷 FR" },
    { code: "EN", label: "🇬🇧 EN" },
    { code: "ES", label: "🇪🇸 ES" },
    { code: "PT", label: "🇵🇹 PT" },
  ];

  const deviseOptions = [
    { code: "XOF", label: "F CFA" },
    { code: "EUR", label: "EUR (€)" },
    { code: "USD", label: "USD ($)" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F5]/95 backdrop-blur-md border-b border-[#E88D9E]/15 py-3 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-2.5">
        
        {/* NIVEAU 1 : Logo au centre + Panier à droite */}
        <div className="flex items-center justify-between relative h-10 sm:h-12">
          
          <div className="w-10 h-10 shrink-0" />

          {/* LOGO MAJESTUEUX CENTRÉ */}
          <a href="/" className="flex flex-col items-center text-center group">
            <span className="font-serif text-sm sm:text-xl md:text-2xl font-bold tracking-[0.18em] text-[#2C2224] group-hover:text-[#E88D9E] transition-colors duration-300 uppercase truncate">
              ANZY COLLECTION
            </span>
            <span className="text-[7px] sm:text-[9px] font-mono tracking-[0.25em] text-[#E88D9E] font-bold uppercase block -mt-0.5 truncate">
              MAISON DE BEAUTÉ & GAINES
            </span>
          </a>

          {/* BOUTON PANIER SOBRE */}
          <button
            type="button"
            onClick={onOpenCart} // 👈 On utilise la propriété passée par le parent
            className="relative p-2.5 rounded-xl bg-[#2C2224] text-white shadow-md hover:bg-[#E88D9E] transition-all duration-300 active:scale-95 shrink-0 cursor-pointer flex items-center justify-center border border-white/10"
            title="Mon Panier"
          >
            <svg
              className="w-4 h-4 text-white stroke-[1.5]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.25 10.5a.75.75 0 100-1.5.75.75 0 000 1.5zm7.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z"
              />
            </svg>

            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E88D9E] text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#FAF7F5] shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* NIVEAU 2 : Les Sélecteurs Customisés */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E88D9E]/10">
          
          {/* Dropdown Langue */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "langue" ? null : "langue")}
              className="flex items-center gap-1.5 bg-white border border-gray-200 text-[10px] font-mono rounded-lg px-3 py-1.5 hover:border-[#E88D9E] text-[#2C2224] shadow-sm transition-colors"
            >
              <span>{langOptions.find((l) => l.code === langue)?.label || langue}</span>
              <svg className={`w-3 h-3 transition-transform ${openDropdown === "langue" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openDropdown === "langue" && (
              <div className="absolute left-0 mt-1 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden py-1">
                {langOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLangue(opt.code as Langue);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 text-[10px] font-mono transition-colors ${
                      langue === opt.code ? "bg-[#E88D9E]/10 text-[#E88D9E] font-bold" : "text-[#2C2224] hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown Devise */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "devise" ? null : "devise")}
              className="flex items-center gap-1.5 bg-white border border-gray-200 text-[10px] font-mono rounded-lg px-3 py-1.5 hover:border-[#E88D9E] text-[#2C2224] shadow-sm transition-colors"
            >
              <span>{deviseOptions.find((d) => d.code === devise)?.label || devise}</span>
              <svg className={`w-3 h-3 transition-transform ${openDropdown === "devise" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openDropdown === "devise" && (
              <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden py-1">
                {deviseOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setDevise(opt.code as Devise);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 text-[10px] font-mono transition-colors ${
                      devise === opt.code ? "bg-[#E88D9E]/10 text-[#E88D9E] font-bold" : "text-[#2C2224] hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Clic à l'extérieur pour fermer les menus */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </header>
  );
}