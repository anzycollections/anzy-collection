"use client";

import { Product, useStore } from "@/context/StoreContext";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  favorites: { [key: string]: boolean };
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export default function ProductCard({ product, onSelect, favorites, onToggleFavorite }: ProductCardProps) {
  const { convertirPrix, symboleDevise } = useStore();

  const prixMin = product.variantes && product.variantes.length > 0
    ? Math.min(...product.variantes.filter(v => v.active).map(v => v.price))
    : product.price;

  const prixAffiche = convertirPrix(prixMin);
  const hasVariantes = product.variantes && product.variantes.length > 0;

  const formatPrix = () => {
    const affiche = `${prixAffiche.toLocaleString()} ${symboleDevise === "F CFA" ? "F CFA" : symboleDevise}`;
    return hasVariantes ? `À partir de ${affiche}` : affiche;
  };

  const mainImage = product.images?.[0] || product.variantes?.find(v => v.active && v.image)?.image || "";

  return (
    <div
      onClick={() => onSelect(product)}
      className="group glass-card glass-card-hover rounded-3xl p-5 cursor-pointer flex flex-col justify-between relative text-[#2C2224]"
    >
      {/* Bouton Favori Glass */}
      <button
        type="button"
        onClick={(e) => onToggleFavorite(product.id, e)}
        className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full glass-pill flex items-center justify-center text-sm shadow-sm hover:scale-110 transition"
      >
        <span className={favorites[product.id] ? "text-[#E88D9E]" : "text-gray-400"}>
          {favorites[product.id] ? "♥" : "♡"}
        </span>
      </button>

      {/* Badge Nouveauté / Bestseller */}
      <div className="absolute top-6 left-6 z-10">
        <span className="glass-pill text-[#2C2224] text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full font-bold">
          {product.badge || "Nouveauté"}
        </span>
      </div>

      {/* Visuel du produit */}
      <div className="h-64 sm:h-72 w-full flex items-center justify-center my-3 overflow-hidden rounded-2xl bg-white/40 backdrop-blur-md border border-white/60">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-500 ease-out p-2"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300 space-y-2">
            <span className="text-4xl">📷</span>
            <span className="text-[10px] font-mono uppercase tracking-wider">Image à venir</span>
          </div>
        )}
      </div>

      {/* Informations Produit */}
      <div className="space-y-2 pt-2">
        <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase block font-bold">
          {product.brand || "ANZY COLLECTION"}
        </span>

        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
          <h3 className="text-sm font-serif font-bold text-[#2C2224] group-hover:text-[#E88D9E] transition line-clamp-2">
            {product.name}
          </h3>
          <span className="text-xs font-bold text-[#2C2224] shrink-0">
            {formatPrix()}
          </span>
        </div>

        {product.description && (
          <p className="text-[11px] text-gray-500 line-clamp-2 font-light">
            {product.description}
          </p>
        )}

        <div className="pt-3 border-t border-[#E88D9E]/10 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#E88D9E] group-hover:translate-x-1 transition font-bold">
            Découvrir la pièce →
          </span>
        </div>
      </div>
    </div>
  );
}