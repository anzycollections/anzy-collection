"use client";

import { Product, useStore } from "@/context/StoreContext";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  favorites: { [key: string]: boolean };
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  viewMode?: "grid" | "list";
}

export default function ProductCard({
  product,
  onSelect,
  favorites,
  onToggleFavorite,
  viewMode = "grid",
}: ProductCardProps) {
  const { convertirPrix, symboleDevise } = useStore();

  if (!product) return null;

  const activeVariantes = product.variantes?.filter((v) => v.active) || [];

  const prixMin =
    activeVariantes.length > 0
      ? Math.min(...activeVariantes.map((v) => v.price))
      : product.price || 0;

  const prixAffiche = convertirPrix(prixMin);
  const hasVariantes = activeVariantes.length > 0;

  const formatPrix = () => {
    const affiche = `${prixAffiche.toLocaleString()} ${
      symboleDevise === "F CFA" ? "F CFA" : symboleDevise
    }`;
    return hasVariantes ? `À partir de ${affiche}` : affiche;
  };

  const mainImage =
    product.images?.[0] || activeVariantes.find((v) => v.image)?.image || "";

  const extraireAttribut = (motsClefs: string[]): string[] => {
    const valeurs = new Set<string>();
    activeVariantes.forEach((v) => {
      Object.entries(v.combo || {}).forEach(([nomOption, valeur]) => {
        const matched = motsClefs.some((m) => nomOption.toLowerCase().includes(m));
        if (matched && valeur) valeurs.add(valeur);
      });
    });
    return Array.from(valeurs);
  };

  const couleurs = extraireAttribut(["couleur", "color"]);
  const tailles = extraireAttribut(["taille", "size", "poids"]);

  // ---- MODE LISTE : ligne compacte pleine largeur ----
  if (viewMode === "list") {
    return (
      <div
        onClick={() => onSelect(product)}
        className="group glass-card glass-card-hover rounded-2xl p-3 cursor-pointer flex items-center gap-4 relative text-[#2C2224]"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-white/40 backdrop-blur-md border border-white/60">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-500 ease-out p-1.5"
            />
          ) : (
            <span className="text-2xl text-gray-300">📷</span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold">
              {product.brand || "ANZY COLLECTION"}
            </span>
            <span className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#FAF7F5] text-[#2C2224] border border-gray-100 shrink-0">
              {product.badge || "Nouveauté"}
            </span>
          </div>

          <h3 className="text-sm font-serif font-bold text-[#2C2224] group-hover:text-[#E88D9E] transition truncate">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-[11px] text-gray-500 line-clamp-1 font-light">
              {product.description}
            </p>
          )}

          {(couleurs.length > 0 || tailles.length > 0) && (
            <div className="flex flex-wrap gap-x-3 text-[10px] font-mono text-gray-500 pt-0.5">
              {couleurs.length > 0 && (
                <span>
                  <strong className="text-gray-700 font-semibold">Couleur:</strong>{" "}
                  {couleurs.join(", ")}
                </span>
              )}
              {tailles.length > 0 && (
                <span>
                  <strong className="text-gray-700 font-semibold">Taille:</strong>{" "}
                  {tailles.join(", ")}
                </span>
              )}
            </div>
          )}

          <span className="text-xs font-bold text-[#2C2224] block pt-1">
            {formatPrix()}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => onToggleFavorite(product.id, e)}
          className="w-9 h-9 rounded-full glass-pill flex items-center justify-center text-sm shadow-sm hover:scale-110 transition shrink-0 cursor-pointer"
        >
          <span className={favorites[product.id] ? "text-[#E88D9E]" : "text-gray-400"}>
            {favorites[product.id] ? "♥" : "♡"}
          </span>
        </button>
      </div>
    );
  }

  // ---- MODE GRILLE (par défaut) ----
  return (
    <div
      onClick={() => onSelect(product)}
      className="group glass-card glass-card-hover rounded-3xl p-5 cursor-pointer flex flex-col justify-between relative text-[#2C2224]"
    >
      <button
        type="button"
        onClick={(e) => onToggleFavorite(product.id, e)}
        className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full glass-pill flex items-center justify-center text-sm shadow-sm hover:scale-110 transition cursor-pointer"
      >
        <span className={favorites[product.id] ? "text-[#E88D9E]" : "text-gray-400"}>
          {favorites[product.id] ? "♥" : "♡"}
        </span>
      </button>

      <div className="absolute top-6 left-6 z-10">
        <span className="glass-pill text-[#2C2224] text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full font-bold shadow-xs">
          {product.badge || "Nouveauté"}
        </span>
      </div>

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

        {(couleurs.length > 0 || tailles.length > 0) && (
          <div className="space-y-1 pt-1">
            {couleurs.length > 0 && (
              <p className="text-[10px] font-mono text-gray-500">
                <strong className="text-gray-700 font-semibold">Couleur:</strong>{" "}
                {couleurs.join(", ")}
              </p>
            )}
            {tailles.length > 0 && (
              <p className="text-[10px] font-mono text-gray-500">
                <strong className="text-gray-700 font-semibold">Taille:</strong>{" "}
                {tailles.join(", ")}
              </p>
            )}
          </div>
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