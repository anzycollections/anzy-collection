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

export interface SiteContent {
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
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [langue, setLangue] = useState<Langue>("fr");
  const [devise, setDevise] = useState<Devise>("XOF");
  const [loading, setLoading] = useState(true);

  // Synchronisation avec Neon au démarrage
 useEffect(() => {
  let isMounted = true;

  async function loadData() {
    try {
      const data = await getStoreData();
      if (data && isMounted) {
        setContent({
          categories: data.categories || [],
          products: (data.products as Product[]) || [],
          hero: data.content?.hero ? (data.content.hero as any) : defaultContent.hero,
          about: data.content?.about ? (data.content.about as any) : defaultContent.about,
          footer: data.content?.footer ? (data.content.footer as any) : defaultContent.footer,
          social: data.content?.social ? (data.content.social as any) : defaultContent.social,
        });
      }
    } catch (err) {
      console.error("Erreur de chargement du store :", err);
    } finally {
      if (isMounted) setLoading(false);
    }
  }

  loadData();

  return () => {
    isMounted = false;
  };
}, []);

  // Sauvegarde dans Neon
  const saveContent = useCallback(async (newContent: SiteContent) => {
    setContent(newContent); // Mise à jour réactive immédiate de l'interface
    try {
      await saveStoreContentAction(newContent);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde sur Neon :", err);
    }
  }, []);

  const convertirPrix = (prix: number) => Math.round((prix || 0) * (tauxConversion["XOF"]?.[devise] || 1));
  const symboleDevise = symbolesDevises[devise] || "F CFA";
  const t = (key: string) => key;

  return (
    <StoreContext.Provider value={{ content, saveContent, langue, devise, setLangue, setDevise, convertirPrix, symboleDevise, t, loading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() { 
  const c = useContext(StoreContext); 
  if (!c) throw new Error("useStore doit être utilisé à l'intérieur d'un StoreProvider"); 
  return c; 
}