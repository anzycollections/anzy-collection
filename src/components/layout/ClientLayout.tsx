"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import CartDrawer from "@/components/ui/CartDrawer";
import { CartUIProvider } from "@/context/CartUIContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="min-h-screen bg-[#FAF7F5]">{children}</main>;
  }

  return (
    <CartUIProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
      <CartDrawer />
    </CartUIProvider>
  );
}
