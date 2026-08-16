"use client";

import { useEffect, useRef } from "react";
import { useStore, Product } from "@/context/StoreContext";
import FeaturedProductCard from "@/components/ui/FeaturedProductCard";

interface FeaturedSliderProps {
  onSelectProduct: (product: Product) => void;
}

export default function FeaturedSlider({ onSelectProduct }: FeaturedSliderProps) {
  const { content, t } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const allProducts: Product[] = content?.products || [];
  const visibleProducts = allProducts.filter((p: Product) => p.visible);

  // Section entièrement contrôlée par l'interrupteur "Mettre en avant" de
  // l'admin — plus de devinette par badge, plus de limite cachée à 4.
  const displayProducts = visibleProducts.filter((p: Product) => p.featured);

  // DÉFILEMENT AUTOMATIQUE TOUTES LES 2 SECONDES
  useEffect(() => {
    if (displayProducts.length <= 1) return; // Pas besoin de scroller s'il y a 0 ou 1 produit

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        // Si on a atteint la fin du slider (à 5px près pour la marge d'erreur)
        if (scrollLeft + clientWidth >= scrollWidth - 5) {
          // On retourne au début en douceur
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Sinon on avance d'une carte (environ 340px : largeur carte + espace)
          scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
        }
      }
    }, 2000); // 2000 millisecondes = 2 secondes

    // Nettoyage de l'intervalle si on quitte le composant
    return () => clearInterval(interval);
  }, [displayProducts.length]);

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 pt-10 pb-2 -mx-4 sm:mx-0 px-4 sm:px-8 py-10 bg-[#2C2224] sm:rounded-[2.5rem]">
      {/* En-tête de la section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-4 px-1">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold block">
            {t("featured.label")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            {t("featured.title")}
          </h2>
        </div>
        <p className="text-xs text-white/50 font-light max-w-xs">
          {t("featured.subtitle")}
        </p>
      </div>

      {/* LE SLIDER HORIZONTAL AVEC LA RÉFÉRENCE */}
      <div 
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory pt-2 pb-6 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayProducts.map((product: Product) => (
          <div 
            key={product.id} 
            className="w-[220px] sm:w-[260px] shrink-0 snap-start"
          >
            <FeaturedProductCard
              product={product}
              onSelect={onSelectProduct}
            />
          </div>
        ))}
      </div>
    </section>
  );
}