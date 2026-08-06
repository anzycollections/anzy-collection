"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Category {
  id: string;
  name: string;
  visible: boolean;
}

export interface VarianteOption {
  name: string;
  values: string[];
}

export interface VarianteCombi {
  id: string;
  combo: Record<string, string>;
  price: number;
  stock: number;
  image: string;
  active: boolean;
}

export interface Product {
  id: string;
  brand?: string;
  name: string;
  categoryId?: string | null;
  category?: string | null; // Champ utilisé par le formulaire admin & l'affichage boutique
  badge?: string | null;
  description?: string | null;
  price: number;
  currency?: string;
  material?: string | null;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  images?: string[];
  image?: string;
  stock?: number;
  visible?: boolean;
  options?: VarianteOption[];
  variantes?: VarianteCombi[];
}

export interface StoreContent {
  categories?: Category[];
  products?: Product[];
  hero?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    images?: string[];
  };
  about?: {
    subtitle?: string;
    title?: string;
    founderName?: string;
    founderRole?: string;
    quote?: string;
    description?: string;
    image?: string;
  };
  footer?: {
    copyright?: string;
    links?: { label: string; url: string }[];
  };
  social?: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
  };
}

export type Langue = "FR" | "EN" | "ES" | "PT";
export type Devise = "XOF" | "EUR" | "USD";

const symbolesDevises: Record<string, string> = { EUR: "€", XOF: "F CFA", USD: "$" };
// Taux approximatifs (base XOF), à ajuster si besoin
const tauxConversion: Record<string, number> = { XOF: 1, EUR: 0.0015, USD: 0.0016 };

interface StoreContextType {
  products: Product[];
  categories: Category[];
  content: StoreContent;
  loading: boolean;
  langue: Langue;
  devise: Devise;
  setLangue: (l: Langue) => void;
  setDevise: (d: Devise) => void;
  convertirPrix: (prixXOF: number) => number;
  symboleDevise: string;
  refreshAll: () => Promise<void>;
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveContent: (newContent: StoreContent) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LANGUE_KEY = "anzy-langue";
const DEVISE_KEY = "anzy-devise";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteConfig, setSiteConfig] = useState<StoreContent>({});
  const [loading, setLoading] = useState(true);

  const [langue, setLangueState] = useState<Langue>("FR");
  const [devise, setDeviseState] = useState<Devise>("XOF");

  // Préférences langue/devise : persistées localement (choix propre au visiteur, pas une donnée boutique)
  useEffect(() => {
    try {
      const savedLangue = localStorage.getItem(LANGUE_KEY) as Langue | null;
      const savedDevise = localStorage.getItem(DEVISE_KEY) as Devise | null;
      if (savedLangue === "FR" || savedLangue === "EN") setLangueState(savedLangue);
      if (savedDevise === "XOF" || savedDevise === "EUR" || savedDevise === "USD") setDeviseState(savedDevise);
    } catch {
      // localStorage indisponible (SSR ou navigation privée) : on garde les valeurs par défaut
    }
  }, []);

  const setLangue = useCallback((l: Langue) => {
    setLangueState(l);
    try {
      localStorage.setItem(LANGUE_KEY, l);
    } catch {}
  }, []);

  const setDevise = useCallback((d: Devise) => {
    setDeviseState(d);
    try {
      localStorage.setItem(DEVISE_KEY, d);
    } catch {}
  }, []);

  const convertirPrix = useCallback(
    (prixXOF: number) => {
      const taux = tauxConversion[devise] ?? 1;
      const converted = prixXOF * taux;
      // XOF : pas de décimales. EUR/USD : arrondi à 2 décimales.
      return devise === "XOF" ? Math.round(converted) : Math.round(converted * 100) / 100;
    },
    [devise]
  );

  const symboleDevise = symbolesDevises[devise] || "F CFA";

  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      const [resProd, resContent] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/content"),
      ]);

      if (resProd.ok) {
        const dataProd = await resProd.json();
        const formatted: Product[] = dataProd.map((p: any) => ({
          ...p,
          category: p.category ?? p.categoryId ?? "",
          price: Number(p.price),
          image: p.images?.[0] || p.image || "",
        }));
        setProducts(formatted);
      }

      if (resContent.ok) {
        const dataContent = await resContent.json();
        setCategories(Array.isArray(dataContent.categories) ? dataContent.categories : []);
        setSiteConfig({
          hero: dataContent.hero || {},
          about: dataContent.about || {},
          footer: dataContent.footer || {},
          social: dataContent.social || {},
        });
      }
    } catch (e) {
      console.error("Erreur synchronisation Neon DB:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const uploadImage = async (file: File): Promise<string> => {
    const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
      method: "POST",
      body: file,
    });
    if (!res.ok) throw new Error("Échec upload d'image");
    const blob = await res.json();
    return blob.url;
  };

  const addProduct = async (newProd: Partial<Product>) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProd),
    });
    if (!res.ok) throw new Error("Échec de la création du produit");
    await refreshAll();
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    if (!res.ok) throw new Error("Échec de la mise à jour du produit");
    await refreshAll();
  };

  const deleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Échec de la suppression du produit");
    await refreshAll();
  };

  // saveContent gère hero / about / footer / social / categories.
  // Les produits ne transitent plus par ici : voir addProduct / updateProduct / deleteProduct.
  const saveContent = async (newContent: StoreContent) => {
    const payload: Record<string, unknown> = {};
    if (newContent.hero) payload.hero = newContent.hero;
    if (newContent.about) payload.about = newContent.about;
    if (newContent.footer) payload.footer = newContent.footer;
    if (newContent.social) payload.social = newContent.social;
    if (newContent.categories) payload.categories = newContent.categories;

    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Échec de la sauvegarde du contenu");
    await refreshAll();
  };

  // Objet "content" unifié exposé aux composants : hero/about/footer/social + categories + products
  const content: StoreContent = {
    ...siteConfig,
    categories,
    products,
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        content,
        loading,
        langue,
        devise,
        setLangue,
        setDevise,
        convertirPrix,
        symboleDevise,
        refreshAll,
        addProduct,
        updateProduct,
        deleteProduct,
        saveContent,
        uploadImage,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore doit être utilisé à l'intérieur de StoreProvider");
  }
  return context;
}
