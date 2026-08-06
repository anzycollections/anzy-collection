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

  // 1. SÉCURITÉ : Si le produit est undefined ou mal formé, on ne l'affiche pas (évite le crash)
  if (!product) return null;

  // 2. SÉCURITÉ : Éviter l'erreur Infinity si aucune variante n'est active
  const activeVariantes = product.variantes?.filter((v) => v.active) || [];

  const prixMin = activeVariantes.length > 0
    ? Math.min(...activeVariantes.map((v) => v.price))
    : (product.price || 0);

  const prixAffiche = convertirPrix(prixMin);
  const hasVariantes = activeVariantes.length > 0;

  const formatPrix = () => {
    const affiche = `${prixAffiche.toLocaleString()} ${
      symboleDevise === "F CFA" ? "F CFA" : symboleDevise
    }`;
    return hasVariantes ? `À partir de ${affiche}` : affiche;
  };

  const mainImage =
    product.images?.[0] ||
    activeVariantes.find((v) => v.image)?.image ||
    "";

  // Les variantes stockent leurs attributs dans un objet "combo" dynamique
  // (ex: { Couleur: "Rouge", Taille: "M" }) — le nom des options est libre,
  // défini par l'admin (voir FormOptionsBuilder). On extrait donc par mots-clés
  // plutôt que par un champ fixe "color"/"size" qui n'existe pas sur VarianteCombi.
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

  const isList = viewMode === "list";

  return (
    <div
      onClick={() => onSelect(product)}
      className={`group glass-card glass-card-hover rounded-3xl p-5 cursor-pointer flex justify-between relative text-[#2C2224] ${
        isList ? "flex-col sm:flex-row gap-6 items-center" : "flex-col"
      }`}
    >
      {/* Bouton Favori Glass */}
      <button
        type="button"
        onClick={(e) => onToggleFavorite(product.id, e)}
        className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full glass-pill flex items-center justify-center text-sm shadow-sm hover:scale-110 transition cursor-pointer"
      >
        <span className={favorites[product.id] ? "text-[#E88D9E]" : "text-gray-400"}>
          {favorites[product.id] ? "♥" : "♡"}
        </span>
      </button>

      {/* Badge Nouveauté / Bestseller */}
      <div className="absolute top-6 left-6 z-10">
        <span className="glass-pill text-[#2C2224] text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full font-bold shadow-xs">
          {product.badge || "Nouveauté"}
        </span>
      </div>

      {/* Visuel du produit */}
      <div
        className={`${
          isList ? "w-full sm:w-48 h-48 shrink-0 my-0" : "h-64 sm:h-72 w-full my-3"
        } flex items-center justify-center overflow-hidden rounded-2xl bg-white/40 backdrop-blur-md border border-white/60`}
      >
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
      <div className={`space-y-2.5 pt-2 ${isList ? "flex-1 w-full" : "w-full"}`}>
        <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase block font-bold">
          {product.brand || "ANZY COLLECTION"}
        </span>

        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-1">
          <h3 className="text-sm font-serif font-bold text-[#2C2224] group-hover:text-[#E88D9E] transition line-clamp-2">
            {product.name}
          </h3>
          <span className="text-xs font-bold text-[#2C2224] shrink-0 font-mono">
            {formatPrix()}
          </span>
        </div>

        {product.description && (
          <p className="text-[11px] text-gray-500 line-clamp-2 font-light">
            {product.description}
          </p>
        )}

        {/* BADGES ATTRIBUTS */}
        <div className="space-y-1.5 pt-1">
          {product.visible && (
            <div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200/60 text-[9px] font-mono font-medium">
                available
              </span>
            </div>
          )}

          {couleurs.length > 0 && (
            <p className="text-[10px] font-mono text-gray-500">
              <strong className="text-gray-700 font-semibold">Couleur:</strong>{" "}
              {couleurs.join(", ")}
            </p>
          )}

          {tailles.length > 0 && (
            <p className="text-[10px] font-mono text-gray-500">
              <strong className="text-gray-700 font-semibold">Poids/Taille:</strong>{" "}
              {tailles.join(", ")}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-[#E88D9E]/10 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#E88D9E] group-hover:translate-x-1 transition font-bold">
            DÉCOUVRIR LA PIÈCE →
          </span>
        </div>
      </div>
    </div>
  );
}