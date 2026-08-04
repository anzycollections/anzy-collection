import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "Anzy Collection",
  description: "ELEVATED FEMININE FASHION & ESSENTIALS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full flex flex-col bg-[#FAF7F5] text-[#2C2224] font-sans selection:bg-[#E88D9E] selection:text-white">
        <StoreProvider>
          <ClientLayout>{children}</ClientLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
