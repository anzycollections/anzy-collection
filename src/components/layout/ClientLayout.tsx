"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import CartDrawer from "@/components/ui/CartDrawer"; // 👈 Assure-toi que le chemin et le nom correspondent à ton composant de panier

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // 1. Création de l'état global pour gérer l'ouverture/fermeture du panier
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (isAdmin) {
    return <main className="min-h-screen bg-[#FAF7F5]">{children}</main>;
  }

  return (
    <>
      {/* 2. On connecte la fonction d'ouverture au bouton du Header */}
      <Header onOpenCart={() => setIsCartOpen(true)} />
      
      <main>{children}</main>
      
      <Footer />
      <ScrollToTop /> 
      
      {/* 3. On place le tiroir du panier ici pour qu'il soit par-dessus tout le reste */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}