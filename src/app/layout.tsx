import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { CartProvider } from "@/context/CartContext";
import ClientLayout from "@/components/layout/ClientLayout";
import { getInitialStoreData } from "@/lib/getInitialStoreData";

export const metadata = {
  title: "Anzy Collection — Maison de Beauté & Gaines",
  description: "Pureté & Traditions Ancestrales",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { products, categories, content } = await getInitialStoreData();

  return (
    <html lang="fr">
      <body className="bg-[#FAF7F5] text-[#2C2224] antialiased">
        <StoreProvider
          initialProducts={products}
          initialCategories={categories}
          initialContent={content}
        >
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