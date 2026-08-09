"use client";

import Image from "next/image";
import { Product, useStore } from "@/context/StoreContext";

interface FeaturedProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function FeaturedProductCard({ product, onSelect }: FeaturedProductCardProps) {
  const { convertirPrix, symboleDevise } = useStore();

  if (!product) return null;

  const activeVariantes = product.variantes?.filter((v) => v.active) || [];
  const prixMin =
    activeVariantes.length > 0
      ? Math.min(...activeVariantes.map((v) => v.price))
      : product.price || 0;
  const prixAffiche = convertirPrix(prixMin);
  const mainImage =
    product.images?.[0] || activeVariantes.find((v) => v.image)?.image || "";

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative w-full aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer shadow-lg"
    >
      {mainImage ? (
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 280px, 320px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-[#2C2224] flex items-center justify-center text-white/30 text-4xl">📷</div>
      )}

      {/* Voile sombre pour lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Badge "Iconique" */}
      <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[9px] font-mono uppercase tracking-widest font-bold">
        ✦ Iconique
      </span>

      {/* Infos produit, superposées en bas */}
      <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
        <h3 className="text-white font-serif text-base leading-snug line-clamp-2">{product.name}</h3>
        <span className="text-white/90 font-mono text-xs font-semibold">
          {prixAffiche.toLocaleString()} {symboleDevise}
        </span>
      </div>
    </div>
  );
}
