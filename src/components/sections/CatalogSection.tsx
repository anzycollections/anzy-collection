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
  const { content, t } = useStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const categories = content?.categories || [];
  const products = content?.products || [];

  const filteredProducts = products.filter((p: Product) => {
    if (!p.visible) return false;
    if (activeCategory === "all") return true;
    return p.category === activeCategory;
  });

  return (
    <section id="catalog" className="space-y-8 scroll-mt-20">
      {/* En-tête de section */}
      <div className="flex flex-col gap-4 border-b border-[#E88D9E]/15 pb-6">
        {/* Titre et Toggle sur la même ligne */}
        <div className="flex flex-row items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold block">
              {t("catalog.label")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2224] mt-1">
              {t("catalog.title")}
            </h2>
          </div>

          {/* Toggle Grille / Liste — Remonté ici */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1 shrink-0 mb-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Affichage en grille"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                viewMode === "grid"
                  ? "bg-[#2C2224] text-white shadow-sm"
                  : "text-gray-400 hover:text-[#2C2224]"
              }`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="Affichage en liste"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                viewMode === "list"
                  ? "bg-[#2C2224] text-white shadow-sm"
                  : "text-gray-400 hover:text-[#2C2224]"
              }`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Ligne catégories */}
        <div className="flex items-center gap-3">
          {/* Navigation par catégories — prend l'espace dispo, scrollable */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 sm:pb-0 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => onCategoryChange("all")}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-[#2C2224] text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#E88D9E]"
              }`}
            >
              {t("catalog.allItems")}
            </button>

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
      </div>

      {/* Grille des cartes produits */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200 space-y-3">
          <span className="text-4xl block">✨</span>
          <p className="text-sm font-medium text-[#2C2224]">
            {t("catalog.empty")}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "list"
              ? "flex flex-col gap-4"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          }
        >
          {filteredProducts.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </section>
  );
}