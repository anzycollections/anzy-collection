"use client";

import { useState, useRef, useEffect } from "react";
import { Product } from "@/context/StoreContext";
import { useStore } from "@/context/StoreContext";
import ProductCard from "../ui/ProductCard";
import ProductDrawer from "../ui/ProductDrawer";

export default function FeaturedSlider() {
  const { content } = useStore();
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const featuredProducts = content.products.filter(
    (p) => p.visible && (p.badge === "Nouveauté" || p.badge === "Bestseller" || p.badge === "Tendance")
  );

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current && featuredProducts.length > 0) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        else sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  if (featuredProducts.length === 0) return null;

  return (
    <>
      <section className="space-y-4">
        <div className="flex justify-between items-end border-b border-[#E88D9E]/20 pb-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase block font-semibold">Sélection Anzy</span>
            <h2 className="text-2xl font-serif font-bold text-[#2C2224]">Pièces Iconiques</h2>
          </div>
          <div className="hidden sm:flex space-x-2">
            <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-[#E88D9E] hover:bg-[#E88D9E] hover:text-white transition">←</button>
            <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-[#E88D9E] hover:bg-[#E88D9E] hover:text-white transition">→</button>
          </div>
        </div>
        <div ref={sliderRef} className="flex space-x-6 overflow-x-auto scrollbar-none scroll-smooth">
          {featuredProducts.map((product) => (
            <div key={product.id} className="min-w-[280px] max-w-[300px] flex-shrink-0">
              <ProductCard product={product} onSelect={setSelectedProduct} favorites={favorites} onToggleFavorite={toggleFavorite} />
            </div>
          ))}
        </div>
      </section>
      {selectedProduct && <ProductDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} cartCount={cartCount} setCartCount={setCartCount} />}
    </>
  );
}
