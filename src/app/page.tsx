"use client";

import { useState } from "react";
import { useStore, Product } from "@/context/StoreContext";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedSlider from "@/components/sections/FeaturedSlider";
import CatalogSection from "@/components/sections/CatalogSection";
import AboutSection from "@/components/sections/AboutSection";
import ProductDrawer from "@/components/ui/ProductDrawer";

export default function Home() {
  const { content } = useStore();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main className="flex-1 w-full bg-[#FAF7F5] text-[#2C2224]">
      {/* 1. Bannière Hero complète */}
      <HeroSection />

      {/* 2. Conteneur des sections Vitrine avec espacement réduit */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 space-y-8 sm:space-y-12">
        
        {/* Section 1 : Pièces Iconiques */}
        <FeaturedSlider
          onSelectProduct={(p: Product) => setSelectedProduct(p)}
        />

        {/* Section 2 : Le Catalogue complet avec filtres */}
        <CatalogSection
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onSelectProduct={(p: Product) => setSelectedProduct(p)}
        />

        {/* Section 3 : L'Univers Anzy (À propos) */}
        <AboutSection />
      </div>

      {/* Tiroir Produit */}
      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}