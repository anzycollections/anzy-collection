"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  category?: string | null;
  badge?: string | null;
  description?: string | null;
  price: number | string;
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
  produits?: Product[];
  hero?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    cta?: string;
    images?: string[];
  };
  about?: {
    subtitle?: string;
    title?: string;
    founderName?: string;
    founderRole?: string;
    quote?: string;
    description?: string;
    paragraph1?: string;
    paragraph2?: string;
    image?: string;
  };
  footer?: {
    brandName?: string;
    tagline?: string;
    copyright?: string;
    whatsapp?: string;
  };
  social?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    whatsapp?: string;
  };
}

interface StoreContextType {
  products: Product[];
  content: StoreContent;
  loading: boolean;
  devise: string;
  symboleDevise: string;
  setDevise: (devise: string) => void;
  convertirPrix: (montant: number | string) => string;
  refreshAll: () => Promise<void>;
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveContent: (newContent: StoreContent) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [content, setContent] = useState<StoreContent>({});
  const [loading, setLoading] = useState(true);
  const [devise, setDevise] = useState("XOF");

  const symbolesMap: Record<string, string> = {
    XOF: "FCFA",
    EUR: "€",
    USD: "$",
  };

  const symboleDevise = symbolesMap[devise] || "FCFA";

  const convertirPrix = (montant: number | string): string => {
    const prixNum = Number(montant) || 0;
    
    // Taux de conversion de base depuis le XOF
    let montantConverti = prixNum;
    if (devise === "EUR") montantConverti = prixNum / 655.957;
    if (devise === "USD") montantConverti = prixNum / 600;

    return `${Math.round(montantConverti).toLocaleString("fr-FR")} ${symboleDevise}`;
  };

  const refreshAll = async () => {
    try {
      setLoading(true);
      const [resProd, resContent] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/content"),
      ]);

      if (resProd.ok) {
        const dataProd = await resProd.json();
        const formatted = dataProd.map((p: any) => ({
          ...p,
          price: Number(p.price),
          image: p.images?.[0] || p.image || "/images/placeholder.jpg",
        }));
        setProducts(formatted);
      }

      if (resContent.ok) {
        const dataContent = await resContent.json();
        if (
          dataContent.about ||
          dataContent.hero ||
          dataContent.categories ||
          dataContent.produits ||
          dataContent.products ||
          dataContent.footer ||
          dataContent.social
        ) {
          setContent(dataContent);
        }
      }
    } catch (e) {
      console.error("Erreur synchronisation Neon DB:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

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
    if (res.ok) await refreshAll();
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    if (res.ok) await refreshAll();
  };

  const deleteProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    if (res.ok) await refreshAll();
  };

  const saveContent = async (newContent: StoreContent) => {
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContent),
    });
    if (res.ok) {
      setContent(newContent);
      await refreshAll();
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        content,
        loading,
        devise,
        symboleDevise,
        setDevise,
        convertirPrix,
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