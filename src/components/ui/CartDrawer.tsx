"use client";

import { useEffect } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // Empêcher le scroll quand le drawer est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E88D9E]/20">
          <h2 className="text-lg font-serif font-bold text-[#2C2224]">Mon Panier</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF7F5] border border-[#E88D9E]/20 flex items-center justify-center text-sm hover:bg-[#E88D9E] hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Contenu vide */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-gray-400">
          <span className="text-5xl mb-4">🛍️</span>
          <p className="text-lg font-serif text-[#2C2224] font-semibold">Votre panier est vide</p>
          <p className="text-sm mt-2 text-center">Ajoutez des produits pour commencer</p>
          <button
            onClick={onClose}
            className="mt-6 bg-[#E88D9E] text-white px-8 py-3 rounded-full text-xs font-medium tracking-widest uppercase hover:bg-[#d67b8c] transition"
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    </>
  );
}
