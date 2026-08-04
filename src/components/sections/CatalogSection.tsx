"use client";

import { useState } from "react";
import { Product, useStore } from "@/context/StoreContext";
import ProductCard from "../ui/ProductCard";
import ProductDrawer from "../ui/ProductDrawer";

interface CatalogSectionProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export default function CatalogSection({ activeCategory, onCategoryChange }: CatalogSectionProps) {
  const { content } = useStore();
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const visibleCategories = content.categories.filter(c => c.visible);
  const visibleProducts = content.products.filter(p => p.visible);

  const filteredProducts = visibleProducts.filter(
    (p) => activeCategory === "all" || p.category === activeCategory
  );

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <section id="catalog" className="space-y-6">
        <div className="flex justify-between items-end border-b border-[#E88D9E]/20 pb-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase block font-semibold">Collection</span>
            <h2 className="text-2xl font-serif font-bold text-[#2C2224]">Explorer les catégories</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg text-sm ${viewMode === "grid" ? "bg-[#E88D9E] text-white" : "bg-white border text-gray-400"}`}>▦</button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg text-sm ${viewMode === "list" ? "bg-[#E88D9E] text-white" : "bg-white border text-gray-400"}`}>☰</button>
          </div>
        </div>

        {/* Catégories visibles */}
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onCategoryChange("all")}
            className={`flex-shrink-0 px-6 py-3 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${
              activeCategory === "all" ? "bg-[#E88D9E] text-white shadow-md scale-105" : "bg-white text-[#2C2224]/80 border border-[#E88D9E]/20"
            }`}>
            Toutes les pièces
          </button>
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${
                activeCategory === cat.id ? "bg-[#E88D9E] text-white shadow-md scale-105" : "bg-white text-[#2C2224]/80 border border-[#E88D9E]/20"
              }`}>
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <span className="text-4xl block mb-4">📦</span>
            <p className="text-sm font-light">Aucun produit dans cette catégorie.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} favorites={favorites} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <div key={product.id} onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-2xl p-4 border border-[#E88D9E]/15 hover:border-[#E88D9E]/50 hover:shadow-md transition cursor-pointer flex items-center space-x-4">
                <div className="w-20 h-20 rounded-xl bg-[#FAF7F5] flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {product.images?.[0] ? <img src={product.images[0]} className="max-h-full max-w-full object-contain" /> : <span className="text-2xl">📷</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase block">{product.brand}</span>
                  <h3 className="text-sm font-serif font-semibold text-[#2C2224] truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{product.description}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-sm font-bold">{product.price.toLocaleString()} F CFA</span>
                    <span className={`text-[10px] font-medium ${product.stock > 7 ? "text-green-500" : product.stock > 0 ? "text-orange-400" : "text-red-400"}`}>
                      {product.stock > 7 ? "🟢 Disponible" : product.stock > 0 ? `🟡 ${product.stock} restants` : "🔴 Rupture"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedProduct && (
        <ProductDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} cartCount={cartCount} setCartCount={setCartCount} />
      )}
    </>
  );
}
