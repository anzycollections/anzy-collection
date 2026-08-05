"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import CartDrawer from "@/components/ui/CartDrawer";

export default function Header() {
  const { langue, devise, setLangue, setDevise } = useStore();
  const [cartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF7F5]/95 backdrop-blur-md border-b border-[#E88D9E]/20">
        <div className="px-4 py-2.5 flex items-center justify-between">
          
          {/* GAUCHE : Logo - MODIFIABLE ICI */}
          <a href="#" className="flex items-center gap-2">
            {/* REMPLACE CETTE DIV PAR TON LOGO */}
            <img src="/logo.png" alt="Anzy" className="h-8 w-auto" />
          </a>

          {/* CENTRE : Drapeaux + Devises */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button onClick={() => setLangue("fr")} className={`text-lg ${langue === "fr" ? "" : "opacity-30"}`}>🇫🇷</button>
              <button onClick={() => setLangue("en")} className={`text-lg ${langue === "en" ? "" : "opacity-30"}`}>🇬🇧</button>
              <button onClick={() => setLangue("es")} className={`text-lg ${langue === "es" ? "" : "opacity-30"}`}>🇪🇸</button>
              <button onClick={() => setLangue("pt")} className={`text-lg ${langue === "pt" ? "" : "opacity-30"}`}>🇵🇹</button>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setDevise("EUR")} className={`text-xs font-bold ${devise === "EUR" ? "text-[#E88D9E]" : "text-gray-400"}`}>€</button>
              <button onClick={() => setDevise("XOF")} className={`text-xs font-bold ${devise === "XOF" ? "text-[#E88D9E]" : "text-gray-400"}`}>F CFA</button>
              <button onClick={() => setDevise("USD")} className={`text-xs font-bold ${devise === "USD" ? "text-[#E88D9E]" : "text-gray-400"}`}>$</button>
            </div>
          </div>

          {/* DROITE : Panier */}
          <button onClick={() => setCartOpen(true)} className="relative p-1.5">
            <span className="text-xl">🛍️</span>
            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-[#E88D9E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>

        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
