"use client";

import { usePathname } from "next/navigation";
import TopBanner from "./TopBanner";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && (
        <>
          <Header />
          <TopBanner />
        </>
      )}
      <div className="flex-1">{children}</div>
      {!isAdmin && <Footer />}
    </>
  );
}
