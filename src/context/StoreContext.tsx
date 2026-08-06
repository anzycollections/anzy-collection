"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  brand: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  price: number;
  currency: string;
  material: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  visible: boolean;
  options: VarianteOption[];
  variantes: VarianteCombi[];
}

interface StoreContextType {
  content: any;
  products: Product[];
  saveContent: (newContent: any) => void;
  devise: string;
  setDevise: (d: string) => void;
  langue: string;
  setLangue: (l: string) => void;
  symboleDevise: string;
  convertirPrix: (prixXOF: number) => number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<any>(null);
  const [devise, setDevise] = useState<string>("XOF");
  const [langue, setLangue] = useState<string>("FR");

  useEffect(() => {
    const saved = localStorage.getItem("anzy-store-content");
    if (saved) {
      try {
        setContent(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur de parsing local store", e);
      }
    } else {
      fetch("/data/content.json")
        .then((res) => res.json())
        .then((data) => {
          setContent(data);
          localStorage.setItem("anzy-store-content", JSON.stringify(data));
        })
        .catch(() => {});
    }
  }, []);

  const saveContent = (newContent: any) => {
    setContent(newContent);
    localStorage.setItem("anzy-store-content", JSON.stringify(newContent));
    window.dispatchEvent(new Event("storage"));
  };

  const symboleDevise = devise === "EUR" ? "€" : devise === "USD" ? "$" : "F CFA";

  const convertirPrix = (prixXOF: number) => {
    if (devise === "EUR") return Math.round(prixXOF / 655.957);
    if (devise === "USD") return Math.round(prixXOF / 600);
    return prixXOF;
  };

  // Récupération sécurisée du tableau de produits depuis le contenu
  const products: Product[] = content?.produits || content?.products || [];

  return (
    <StoreContext.Provider
      value={{
        content,
        products,
        saveContent,
        devise,
        setDevise,
        langue,
        setLangue,
        symboleDevise,
        convertirPrix,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore doit être utilisé dans un StoreProvider");
  return ctx;
}