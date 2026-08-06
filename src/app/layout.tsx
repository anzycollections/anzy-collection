import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { CartProvider } from "@/context/CartContext";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata = {
  title: "Anzy Collection — Maison de Beauté & Gaines",
  description: "Pureté & Traditions Ancestrales",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-[#FAF7F5] text-[#2C2224] antialiased">
        <StoreProvider>
          <CartProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}