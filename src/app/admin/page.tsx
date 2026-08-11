"use client";

import { useState, useEffect } from "react";
import { Product, useStore } from "@/context/StoreContext";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import CategoryManager from "./components/CategoryManager";
import ShippingTab from "./components/ShippingTab";
import HeroTab from "./components/HeroTab";
import AboutTab from "./components/AboutTab";
import FooterTab from "./components/FooterTab";
import ReviewsTab from "./components/ReviewsTab";
import OrdersTab from "./components/OrdersTab";
import LookbookTab from "./components/LookbookTab";

type Tab = "products" | "categories" | "hero" | "about" | "footer" | "reviews" | "shipping" | "orders" | "lookbook";

export default function AdminPage() {
  const { content, products, saveContent, addProduct, updateProduct, deleteProduct } = useStore();
  
  // État pour savoir si les données ont bien été chargées
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTabMenu, setShowTabMenu] = useState(false);

  // Protection : On attend que le contenu soit chargé au moins une fois
  useEffect(() => {
    if (content && Object.keys(content).length > 0) {
      setIsInitialized(true);
    }
  }, [content]);

  const productList: Product[] = products || [];
  const filtered = productList.filter((p: Product) =>
    p?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveProduct = async (productData: Product) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (e) {
      console.error(e);
      alert("Une erreur est survenue lors de l'enregistrement du produit.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
    } catch (e) {
      console.error(e);
      alert("Une erreur est survenue lors de la suppression du produit.");
    }
  };

  const handleDuplicateProduct = async (product: Product) => {
    try {
      // On enlève l'id existant pour que la base en génère un nouveau, et on
      // masque la copie par défaut le temps de l'ajuster (nom, prix, stock...)
      const { id, ...rest } = product as any;
      await addProduct({
        ...rest,
        name: `${product.name} (copie)`,
        visible: false,
      });
    } catch (e) {
      console.error(e);
      alert("Une erreur est survenue lors de la duplication du produit.");
    }
  };

  const handleToggleVisible = async (product: Product) => {
    try {
      await updateProduct(product.id, { visible: !product.visible } as Partial<Product>);
    } catch (e) {
      console.error(e);
      alert("Une erreur est survenue lors du changement de visibilité.");
    }
  };

  const tabs = [
    { id: "products", label: "PRODUITS", code: "01" },
    { id: "categories", label: "CATÉGORIES", code: "02" },
    { id: "shipping", label: "LIVRAISON", code: "03" },
    { id: "hero", label: "SECTION HERO", code: "04" },
    { id: "about", label: "À PROPOS", code: "05" },
    { id: "footer", label: "PIED DE PAGE", code: "06" },
    { id: "reviews", label: "AVIS CLIENTS", code: "07" },
    { id: "orders", label: "COMMANDES", code: "08" },
    { id: "lookbook", label: "LOOKBOOK", code: "09" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F5] p-4 sm:p-6 lg:p-10 text-[#2C2224] pb-28">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end border-b border-[#E88D9E]/20 pb-5">
          <div>
            <span className="text-[9px] font-mono tracking-[0.25em] text-[#E88D9E] uppercase font-bold block mb-1">
              ADMINISTRATION • ANZY COLLECTION
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#2C2224]">
              Tableau de Bord
            </h1>
          </div>
          <a 
            href="/" 
            target="_blank" 
            className="text-[11px] font-mono tracking-widest text-[#E88D9E] hover:text-[#2C2224] uppercase transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Aperçu boutique</span>
            <span className="text-xs">↗</span>
          </a>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTabMenu(!showTabMenu)}
            className="w-full sm:w-auto flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-[#2C2224] text-white text-[10px] font-mono tracking-[0.15em] uppercase font-bold shadow-md cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="text-[#E88D9E]">{tabs.find((t) => t.id === activeTab)?.code}</span>
              <span>{tabs.find((t) => t.id === activeTab)?.label}</span>
            </span>
            <span className={`text-xs transition-transform duration-200 ${showTabMenu ? "rotate-180" : ""}`}>▾</span>
          </button>

          {showTabMenu && (
            <>
              {/* Voile pour fermer le menu au clic à l'extérieur */}
              <div className="fixed inset-0 z-30" onClick={() => setShowTabMenu(false)} />
              <div className="absolute top-full left-0 mt-2 w-full sm:w-72 bg-white rounded-2xl border border-gray-100 shadow-xl z-40 overflow-hidden py-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => { setActiveTab(tab.id as Tab); setShowTabMenu(false); }}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 text-[10px] font-mono tracking-[0.15em] uppercase text-left transition cursor-pointer ${
                        isActive ? "bg-[#FAF7F5] text-[#2C2224] font-bold" : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className={isActive ? "text-[#E88D9E]" : "text-gray-300"}>{tab.code}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Rechercher une pièce par nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl border border-gray-200 text-xs bg-white focus:border-[#E88D9E] focus:outline-none shadow-sm transition"
                />
              </div>
              <button
                onClick={() => { setEditingProduct(null); setShowForm(!showForm); }}
                className="bg-[#E88D9E] text-white px-6 py-3 rounded-2xl text-[10px] font-mono font-bold uppercase tracking-widest shadow-md hover:bg-[#d67b8c] active:scale-98 transition text-center shrink-0 cursor-pointer"
              >
                {showForm ? "Fermer le formulaire" : "+ Nouvelle création"}
              </button>
            </div>
            {showForm && (
              <ProductForm editingProduct={editingProduct} onSave={handleSaveProduct} />
            )}
            <ProductTable products={filtered} onEdit={(p: Product) => { setEditingProduct(p); setShowForm(true); }} onDelete={handleDeleteProduct} onDuplicate={handleDuplicateProduct} onToggleVisible={handleToggleVisible} />
          </div>
        )}

        {/* On n'affiche les onglets que si isInitialized est true pour éviter les formulaires vides */}
        {isInitialized ? (
          <>
            {activeTab === "categories" && <CategoryManager />}
            {activeTab === "shipping" && <ShippingTab content={content} saveContent={saveContent} />}
            {activeTab === "hero" && <HeroTab content={content} saveContent={saveContent} />}
            {activeTab === "about" && <AboutTab content={content} saveContent={saveContent} />}
            {activeTab === "footer" && <FooterTab content={content} saveContent={saveContent} />}
            {activeTab === "reviews" && <ReviewsTab />}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "lookbook" && <LookbookTab content={content} saveContent={saveContent} />}
          </>
        ) : (
          <div className="py-20 text-center font-mono text-xs text-gray-400 uppercase tracking-widest">Chargement des données...</div>
        )}

      </div>
    </div>
  );
}