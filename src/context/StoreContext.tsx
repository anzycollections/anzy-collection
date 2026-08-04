"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface VarianteOption { name: string; values: string[]; }
export interface VarianteCombi { id: string; combo: Record<string, string>; price: number; stock: number; image: string; active: boolean; }
export interface Product {
  id: string; brand: string; name: string; category: string; badge: string;
  description: string; price: number; currency: string; material: string;
  sizes: string[]; colors: { name: string; hex: string }[]; images: string[];
  stock: number; visible: boolean;
  options: VarianteOption[];
  variantes: VarianteCombi[];
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
  categories: [
    { id: "protheses", name: "Prothèses", visible: true }, { id: "gaines", name: "Gaines", visible: true }, { id: "fesses", name: "Fesses en Chiffon", visible: true },
    { id: "vetements", name: "Vêtements", visible: true }, { id: "huiles", name: "Huiles Essentielles", visible: true }, { id: "thes", name: "Thés & Infusions", visible: true }, { id: "skincare", name: "Skincare", visible: true },
  ],
  products: [
    { id: "p1", brand: "ANZY", name: "Prothèse Silicone", category: "protheses", badge: "Bestseller", description: "Prothèse médicale.", price: 50000, currency: "XOF", material: "Silicone", sizes: ["Unique"], colors: [{ name: "Chair", hex: "#E8C4A2" }], images: [], stock: 25, visible: true,
      options: [{ name: "Couleur", values: ["Chair Claire", "Marron Foncé"] }, { name: "Poids", values: ["500g", "750g", "1kg"] }],
      variantes: [
        { id: "v1", combo: {"Couleur":"Chair Claire","Poids":"500g"}, price: 50000, stock: 10, image: "", active: true },
        { id: "v2", combo: {"Couleur":"Chair Claire","Poids":"750g"}, price: 65000, stock: 5, image: "", active: true },
        { id: "v3", combo: {"Couleur":"Marron Foncé","Poids":"750g"}, price: 65000, stock: 3, image: "", active: true },
        { id: "v4", combo: {"Couleur":"Marron Foncé","Poids":"1kg"}, price: 80000, stock: 8, image: "", active: true },
      ]
    },
  ]
};

const STORAGE_KEY = "anzy-content-v3";
const symbolesDevises: Record<string, string> = { EUR: "€", XOF: "F CFA", USD: "$" };
const tauxConversion: Record<string, Record<string, number>> = { EUR: { EUR: 1, XOF: 655.96, USD: 1.08 }, XOF: { EUR: 0.0015, XOF: 1, USD: 0.0016 }, USD: { EUR: 0.93, XOF: 609, USD: 1 } };

interface StoreContextType {
  content: SiteContent; saveContent: (c: SiteContent) => void;
  langue: Langue; devise: Devise; setLangue: (l: Langue) => void; setDevise: (d: Devise) => void;
  convertirPrix: (p: number) => number; symboleDevise: string; t: (key: string) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function loadFromStorage(): SiteContent | null {
  if (typeof window === "undefined") return null;
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) { const p = JSON.parse(s); if (p.categories?.length > 0) return p; } } catch(e) {}
  return null;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => loadFromStorage() || defaultContent);
  const [langue, setLangue] = useState<Langue>("fr");
  const [devise, setDevise] = useState<Devise>("XOF");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { const s = loadFromStorage(); if (s) setContent(s); setLoaded(true); }, []);
  useEffect(() => { const h = (e: StorageEvent) => { if (e.key === STORAGE_KEY && e.newValue) { try { const p = JSON.parse(e.newValue); if (p.categories?.length > 0) setContent(p); } catch {} } }; window.addEventListener("storage", h); return () => window.removeEventListener("storage", h); }, []);
  const saveContent = useCallback((c: SiteContent) => { setContent(c); localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); }, []);
  const convertirPrix = (prix: number) => Math.round(prix * (tauxConversion["XOF"]?.[devise] || 1));
  const symboleDevise = symbolesDevises[devise] || "F CFA"; const t = (key: string) => key;
  if (!loaded) return null;

  return (<StoreContext.Provider value={{ content, saveContent, langue, devise, setLangue, setDevise, convertirPrix, symboleDevise, t }}>{children}</StoreContext.Provider>);
}

export function useStore() { const c = useContext(StoreContext); if (!c) throw new Error("useStore error"); return c; }
