"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DEFAULT_SHIPPING_PRICES } from "@/data/shippingZones";
import { UI_STRINGS } from "@/i18n/uiStrings";

export interface Category {
  id: string;
  name: string;
  visible: boolean;
}

export interface VarianteOption {
  name: string;
  values: string[];
  colorMap?: Record<string, string>;
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
  price: number;
  currency?: string;
  material?: string | null;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  images?: string[];
  image?: string;
  stock?: number;
  visible?: boolean;
  featured?: boolean;
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
  lookbook?: {
    id: string;
    imageUrl: string;
    title?: string;
    subtitle?: string;
    link?: string;
  }[];
  shippingPrices?: Record<string, number>;
}

export type Langue = "FR" | "EN" | "ES" | "PT";
export type Devise = "XOF" | "EUR" | "USD";

const symbolesDevises: Record<string, string> = { EUR: "€", XOF: "F CFA", USD: "$" };
const tauxConversion: Record<string, number> = { XOF: 1, EUR: 0.0015, USD: 0.0016 };

const DEFAULT_FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    brand: "ANZY COLLECTION",
    name: "Gaine Amincissante en Silicone Haute Performance",
    categoryId: "gaines",
    category: "gaines",
    badge: "Bestseller",
    description: "Gaine sculptante invisible sous les vêtements, conçue en silicone respirant pour un maintien optimal et un effet ventre plat instantané.",
    price: 160000,
    currency: "XOF",
    material: "Silicone & Coton",
    sizes: ["S", "M", "L", "XL", "2XL"],
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop"],
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop",
    stock: 15,
    visible: true,
    options: [{ name: "Taille", values: ["S", "M", "L", "XL", "2XL"] }],
    variantes: [
      { id: "v1", combo: { Taille: "S" }, price: 160000, stock: 5, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop", active: true },
      { id: "v2", combo: { Taille: "M" }, price: 160000, stock: 5, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop", active: true },
    ]
  },
  {
    id: "prod-2",
    brand: "ANZY COLLECTION",
    name: "Body Sculptant Invisible",
    categoryId: "gaines",
    category: "gaines",
    badge: "Nouveau",
    description: "Un maintien complet du buste aux cuisses pour une silhouette parfaitement dessinée en toute occasion.",
    price: 45000,
    currency: "XOF",
    material: "Élasthanne premium",
    sizes: ["S", "M", "L", "XL"],
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"],
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    stock: 20,
    visible: true,
    options: [{ name: "Taille", values: ["S", "M", "L", "XL"] }],
    variantes: [
      { id: "v4", combo: { Taille: "S" }, price: 45000, stock: 10, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", active: true },
    ]
  }
];

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
  t: (key: string) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LANGUE_KEY = "anzy-langue";
const DEVISE_KEY = "anzy-devise";

export function StoreProvider({
  children,
  initialProducts,
  initialCategories,
  initialContent,
}: {
  children: React.ReactNode;
  initialProducts?: Product[];
  initialCategories?: Category[];
  initialContent?: StoreContent;
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [categories, setCategories] = useState<Category[]>(
    initialCategories && initialCategories.length > 0
      ? initialCategories
      : [
          { id: "gaines", name: "Gaines", visible: true },
          { id: "huiles", name: "Huiles Essentielles", visible: true }
        ]
  );
  const [siteConfig, setSiteConfig] = useState<StoreContent>(initialContent || {});
  const [uiStrings, setUiStrings] = useState<Record<string, string>>(UI_STRINGS);
  // Si des données initiales (chargées côté serveur) sont déjà là, pas besoin
  // d'afficher un état de chargement au premier rendu.
  const [loading, setLoading] = useState(!initialProducts);

  const [langue, setLangueState] = useState<Langue>("FR");
  const [devise, setDeviseState] = useState<Devise>("XOF");

  useEffect(() => {
    try {
      const savedLangue = localStorage.getItem(LANGUE_KEY) as Langue | null;
      const savedDevise = localStorage.getItem(DEVISE_KEY) as Devise | null;
      if (savedLangue === "FR" || savedLangue === "EN" || savedLangue === "ES" || savedLangue === "PT") setLangueState(savedLangue);
      if (savedDevise === "XOF" || savedDevise === "EUR" || savedDevise === "USD") setDeviseState(savedDevise);
    } catch {}
  }, []);

  const setLangue = useCallback((l: Langue) => {
    setLangueState(l);
    try { localStorage.setItem(LANGUE_KEY, l); } catch {}
  }, []);

  const setDevise = useCallback((d: Devise) => {
    setDeviseState(d);
    try { localStorage.setItem(DEVISE_KEY, d); } catch {}
  }, []);

  const convertirPrix = useCallback(
    (prixXOF: number) => {
      const taux = tauxConversion[devise] ?? 1;
      const converted = prixXOF * taux;
      return devise === "XOF" ? Math.round(converted) : Math.round(converted * 100) / 100;
    },
    [devise]
  );

  const symboleDevise = symbolesDevises[devise] || "F CFA";

  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      const [resProd, resContent, resUi] = await Promise.all([
        fetch(`/api/products?lang=${langue}`),
        fetch(`/api/content?lang=${langue}`, { cache: "no-store" }),
        fetch(`/api/ui-strings?lang=${langue}`),
      ]);

      if (resUi.ok) {
        const dataUi = await resUi.json();
        setUiStrings({ ...UI_STRINGS, ...dataUi });
      }

      if (resProd.ok) {
        const dataProd = await resProd.json();
        if (Array.isArray(dataProd) && dataProd.length > 0) {
          const formatted: Product[] = dataProd.map((p: any) => ({
            ...p,
            category: p.category ?? p.categoryId ?? "",
            price: Number(p.price),
            image: p.images?.[0] || p.image || "",
          }));
          setProducts(formatted);
        }
      }

      if (resContent.ok) {
        const dataContent = await resContent.json();
        if (Array.isArray(dataContent.categories) && dataContent.categories.length > 0) {
          setCategories(dataContent.categories);
        }
        setSiteConfig({
          hero: dataContent.hero || {},
          about: dataContent.about || {},
          footer: dataContent.footer || {},
          social: dataContent.social || {},
          lookbook: dataContent.lookbook || [],
          shippingPrices: dataContent.shippingPrices || DEFAULT_SHIPPING_PRICES,
        });
      }
    } catch (e) {
      console.error("Erreur synchronisation DB, utilisation du fallback:", e);
    } finally {
      setLoading(false);
    }
  }, [langue]);

  // Se relance automatiquement quand la langue change (refreshAll est
  // recréée avec la nouvelle langue à chaque changement de "langue" ci-dessus).
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

  // Rafraîchit uniquement la liste des produits (plus léger que refreshAll,
  // qui recharge aussi tout le contenu du site inutilement pour ces actions).
  const refreshProducts = async () => {
    const resProd = await fetch("/api/products");
    if (resProd.ok) {
      const dataProd = await resProd.json();
      if (Array.isArray(dataProd)) {
        const formatted: Product[] = dataProd.map((p: any) => ({
          ...p,
          category: p.category ?? p.categoryId ?? "",
          price: Number(p.price),
          image: p.images?.[0] || p.image || "",
        }));
        setProducts(formatted);
      }
    }
  };

  const addProduct = async (newProd: Partial<Product>) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProd),
    });
    if (!res.ok) throw new Error("Échec de la création du produit");
    await refreshProducts();
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    // Bascule immédiate à l'écran (ex: masquer/afficher) — la sauvegarde
    // réseau se fait ensuite en arrière-plan, sans faire attendre le clic.
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    if (!res.ok) {
      await refreshProducts(); // en cas d'échec, on resynchronise avec la vraie valeur
      throw new Error("Échec de la mise à jour du produit");
    }
  };

  const deleteProduct = async (id: string) => {
    const previous = products;
    setProducts((prev) => prev.filter((p) => p.id !== id)); // retrait immédiat à l'écran
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setProducts(previous); // en cas d'échec, on remet le produit
      throw new Error("Échec de la suppression du produit");
    }
  };

  const saveContent = async (newContent: StoreContent) => {
    const payload: Record<string, unknown> = {};
    if (newContent.hero) payload.hero = newContent.hero;
    if (newContent.about) payload.about = newContent.about;
    if (newContent.footer) payload.footer = newContent.footer;
    if (newContent.social) payload.social = newContent.social;
    if (newContent.categories) payload.categories = newContent.categories;
    if (newContent.shippingPrices) payload.shippingPrices = newContent.shippingPrices;
    if (newContent.lookbook) payload.lookbook = newContent.lookbook;

    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Échec de la sauvegarde du contenu");
    await refreshAll();
  };

  const content: StoreContent = {
    ...siteConfig,
    categories,
    products,
  };

  // Renvoie le texte fixe traduit pour une clé (ex: t("product.addToCart")).
  // Retombe sur le français si la clé n'existe pas encore côté traduction.
  const t = useCallback(
    (key: string) => uiStrings[key] ?? UI_STRINGS[key] ?? key,
    [uiStrings]
  );

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
        t,
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
