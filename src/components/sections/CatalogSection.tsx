"use client";

import { useState } from "react";
import { Product, useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ui/ProductCard";

interface CatalogSectionProps {
  activeCategory: string;
  onCategoryChange: (catId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export default function CatalogSection({
  activeCategory,
  onCategoryChange,
  onSelectProduct,
}: CatalogSectionProps) {
  const { content } = useStore();
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  const categories = content?.categories || [];
  const products = content?.products || [];

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. Filtrage typé des produits (p: Product)
  const filteredProducts = products.filter((p: Product) => {
    if (!p.visible) return false;
    if (activeCategory === "all") return true;
    return p.category === activeCategory;
  });

  return (
    <section id="catalog" className="space-y-8 scroll-mt-20">
      {/* En-tête de section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E88D9E]/15 pb-6">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold block">
            NOTRE SÉLECTION
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2224] mt-1">
            Le Catalogue
          </h2>
        </div>

        {/* Navigation par catégories */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 sm:pb-0">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              activeCategory === "all"
                ? "bg-[#2C2224] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#E88D9E]"
            }`}
          >
            Tous les articles
          </button>

          {/* 2. Filtres typés des catégories (c: any, cat: any) */}
          {categories
            .filter((c: any) => c.visible)
            .map((cat: any) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-[#2C2224] text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#E88D9E]"
                }`}
              >
                {cat.name}
              </button>
            ))}
        </div>
      </div>

      {/* Grille des cartes produits */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200 space-y-3">
          <span className="text-4xl block">✨</span>
          <p className="text-sm font-medium text-[#2C2224]">
            Aucun article disponible dans cette catégorie pour le moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 3. Mappage typé des cartes produits (product: Product) */}
          {filteredProducts.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}