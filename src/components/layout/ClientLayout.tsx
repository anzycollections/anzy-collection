"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// Importation corrigée vers le dossier ui :
import CartDrawer from "@/components/ui/CartDrawer"; 

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5] text-[#2C2224] selection:bg-[#E88D9E] selection:text-white">
      <Header onOpenCart={() => setIsCartOpen(true)} />
      
      <main className="flex-1">
        {children}
      </main>

      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}