"use client";

import { useCart } from "@/context/CartContext";

export default function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-[#E88D9E]/15 px-4 sm:px-8 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        <div className="flex-1" />

        <div className="text-center">
          <a href="/" className="block">
            <h1 className="text-lg sm:text-xl font-serif font-bold tracking-[0.2em] text-[#2C2224] uppercase">
              ANZY COLLECTION
            </h1>
            <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.3em] text-[#E88D9E] uppercase block mt-0.5">
              MAISON DE BEAUTÉ & GAINES
            </span>
          </a>
        </div>

        <div className="flex-1 flex justify-end">
          <button
            onClick={onOpenCart}
            className="relative p-3 rounded-2xl bg-[#2C2224] text-white hover:bg-[#E88D9E] transition-all duration-300 shadow-md cursor-pointer group"
            aria-label="Panier"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E88D9E] text-white text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
