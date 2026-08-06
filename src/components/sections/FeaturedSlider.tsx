"use client";

import { useStore, Product } from "@/context/StoreContext";
import ProductCard from "@/components/ui/ProductCard";

interface FeaturedSliderProps {
  onSelectProduct: (product: Product) => void;
}

export default function FeaturedSlider({ onSelectProduct }: FeaturedSliderProps) {
  const { content } = useStore();

  const allProducts: Product[] = content?.products || [];
  const visibleProducts = allProducts.filter((p: Product) => p.visible);

  const taggedProducts = visibleProducts.filter(
    (p: Product) =>
      p.badge === "Bestseller" ||
      p.badge === "Incontournable" ||
      p.badge === "Tendance" ||
      p.badge === "Nouveauté"
  );

  const displayProducts =
    taggedProducts.length > 0
      ? taggedProducts.slice(0, 4)
      : visibleProducts.slice(0, 4);

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E88D9E]/15 pb-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold block">
            SÉLECTION ANZY
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C2224]">
            Pièces Iconiques
          </h2>
        </div>
        <p className="text-xs text-gray-500 font-light max-w-xs">
          Les incontournables plébiscités par nos clientes pour sublimer vos courbes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProducts.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
            favorites={{}}
            onToggleFavorite={() => {}}
          />
        ))}
      </div>
    </section>
  );
}