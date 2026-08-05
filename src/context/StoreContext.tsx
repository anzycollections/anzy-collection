"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { getStoreData, saveStoreContentAction } from "@/app/actions/store";

export interface VarianteOption { name: string; values: string[]; }
export interface VarianteCombi { id: string; combo: Record<string, string>; price: number; stock: number; image: string; active: boolean; }
export interface Product {
  id: string; brand: string; name: string; category: string; badge: string;
  description: string; price: number; currency: string; material: string;
  sizes: string[]; colors: { name: string; hex: string }[]; images: string[];
  stock: number; visible: boolean; options: VarianteOption[]; variantes: VarianteCombi[];
}
export interface Category { id: string; name: string; visible: boolean; }
export type Langue = "fr" | "en" | "es" | "pt";
export type Devise = "EUR" | "XOF" | "USD";

interface SiteContent {
  hero: { title: string; subtitle: string; cta: string; images: string[]; badge: string };
  about: { title: string; subtitle: string; paragraph1: string; paragraph2: string; image: string; stats: { value: string; label: string }[] };
  footer: { copyright: string; links: { label: string; url: string }[] };
  social: { instagram: string; tiktok: string; facebook: string };
  categories: Category[];
  products: Product[];
}

const defaultContent: SiteContent = {
  hero: { title: "EMPOWER YOUR BEAUTY", subtitle: "Découvrez notre collection.", cta: "Découvrir la Collection", images: [], badge: "Nouvelle Saison 2026" },
  about: { title: "L'élégance à la française", subtitle: "Notre Histoire", paragraph1: "Fondée par Helena Mcneil.", paragraph2: "Chaque pièce sublime la femme moderne.", image: "", stats: [] },
  footer: { copyright: "© 2026 Anzy Collection.", links: [] },
  social: { instagram: "", tiktok: "", facebook: "" },
  categories: [],
  products: []
};

const symbolesDevises: Record<string, string> = { EUR: "€", XOF: "F CFA", USD: "$" };
const tauxConversion: Record<string, Record<string, number>> = { EUR: { EUR: 1, XOF: 655.96, USD: 1.08 }, XOF: { EUR: 0.0015, XOF: 1, USD: 0.0016 }, USD: { EUR: 0.93, XOF: 609, USD: 1 } };

interface StoreContextType {
  content: SiteContent; saveContent: (c: SiteContent) => void;
  langue: Langue; devise: Devise; setLangue: (l: Langue) => void; setDevise: (d: Devise) => void;
  convertirPrix: (p: number) => number; symboleDevise: string; t: (key: string) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [langue, setLangue] = useState<Langue>("fr");
  const [devise, setDevise] = useState<Devise>("XOF");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getStoreData().then(data => {
      if (data) {
        setContent({
          hero: data.content?.hero || defaultContent.hero,
          about: data.content?.about || defaultContent.about,
          footer: data.content?.footer || defaultContent.footer,
          social: data.content?.social || defaultContent.social,
          categories: data.categories || defaultContent.categories,
          products: data.products || [],
        });
      }
      setLoaded(true);
    });
  }, []);

  const saveContent = useCallback((c: SiteContent) => {
    setContent(c);
    saveStoreContentAction(c);
  }, []);

  const convertirPrix = (prix: number) => Math.round(prix * (tauxConversion["XOF"]?.[devise] || 1));
  const symboleDevise = symbolesDevises[devise] || "F CFA";
  const t = (key: string) => key;
  if (!loaded) return <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#E88D9E] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <StoreContext.Provider value={{ content, saveContent, langue, devise, setLangue, setDevise, convertirPrix, symboleDevise, t }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() { const c = useContext(StoreContext); if (!c) throw new Error("useStore error"); return c; }
