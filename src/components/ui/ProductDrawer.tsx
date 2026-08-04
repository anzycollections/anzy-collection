"use client";

import { useState } from "react";
import { Product, useStore } from "@/context/StoreContext";

interface ProductDrawerProps {
  product: Product;
  onClose: () => void;
  cartCount: number;
  setCartCount: (count: number) => void;
}

export default function ProductDrawer({ product, onClose, cartCount, setCartCount }: ProductDrawerProps) {
  const { convertirPrix, symboleDevise } = useStore();
  const hasVariantes = product.variantes && product.variantes.length > 0;

  // État : combinaison sélectionnée
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    if (hasVariantes) {
      const first = product.variantes[0];
      return first.combo;
    }
    return {};
  });

  // Trouver la variante correspondante
  const currentVariante = hasVariantes
    ? product.variantes.find(v =>
        Object.entries(selected).every(([key, val]) => v.combo[key] === val) && v.active
      )
    : null;

  const prixAffiche = currentVariante ? convertirPrix(currentVariante.price) : convertirPrix(product.price);
  const stockAffiche = currentVariante ? currentVariante.stock : product.stock;
  const imageAffiche = currentVariante?.image || product.images?.[0] || "";

  const formatPrix = () => {
    if (symboleDevise === "F CFA") return `${prixAffiche.toLocaleString()} F CFA`;
    return `${symboleDevise} ${prixAffiche.toLocaleString()}`;
  };

  const handleOptionClick = (optionName: string, value: string) => {
    setSelected(prev => ({ ...prev, [optionName]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-xl h-full overflow-y-auto p-6 sm:p-10 flex flex-col justify-between shadow-2xl relative">
        <button onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#FAF7F5] border border-[#E88D9E]/20 flex items-center justify-center text-lg hover:bg-[#E88D9E] hover:text-white transition">
          ✕
        </button>

        <div className="space-y-8">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase block font-semibold">{product.brand}</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2224] mt-1">{product.name}</h2>
            <p className="text-xl font-semibold text-[#2C2224] mt-2">{formatPrix()}</p>
          </div>

          <div className="bg-[#FAF7F5] rounded-3xl p-8 flex justify-center items-center h-80 border border-[#E88D9E]/20">
            {imageAffiche ? (
              <img src={imageAffiche} alt={product.name} className="max-h-full object-contain drop-shadow-md" />
            ) : (
              <span className="text-6xl text-gray-300">📷</span>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#E88D9E] font-semibold">Description</h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">{product.description}</p>
          </div>

          {/* OPTIONS */}
          {hasVariantes && product.options && product.options.map(opt => (
            <div key={opt.name} className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500">
                {opt.name} : <span className="text-[#2C2224] font-semibold">{selected[opt.name]}</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {opt.values.map(val => {
                  // Vérifier si cette valeur est disponible dans au moins une variante active
                  const isAvailable = product.variantes.some(v =>
                    v.active && v.combo[opt.name] === val &&
                    Object.entries(selected).every(([k, vl]) => k === opt.name || v.combo[k] === vl)
                  );
                  return (
                    <button key={val}
                      onClick={() => isAvailable && handleOptionClick(opt.name, val)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition ${
                        selected[opt.name] === val
                          ? "bg-[#E88D9E] text-white border-[#E88D9E]"
                          : isAvailable
                          ? "bg-white text-[#2C2224] border-gray-200 hover:border-[#E88D9E]"
                          : "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through"
                      }`}>
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* STOCK */}
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${stockAffiche > 7 ? "bg-green-500" : stockAffiche > 0 ? "bg-orange-400" : "bg-red-400"}`} />
            <span className="text-xs text-gray-500">
              {stockAffiche > 7 ? "En stock" : stockAffiche > 0 ? `Plus que ${stockAffiche} en stock` : "Rupture de stock"}
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 space-y-3 mt-6">
          <button
            onClick={() => { setCartCount(cartCount + 1); onClose(); }}
            disabled={stockAffiche <= 0}
            className={`w-full py-4 rounded-2xl font-medium text-xs tracking-widest uppercase transition shadow-xl ${
              stockAffiche > 0
                ? "bg-[#E88D9E] text-white hover:bg-[#d67b8c]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}>
            {stockAffiche > 0 ? `Ajouter au panier — ${formatPrix()}` : "Rupture de stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
