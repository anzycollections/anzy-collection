"use client";

import { useState, useEffect } from "react";
import { useStore, Product, StoreContent } from "@/context/StoreContext";
import ProductTable from "./components/ProductTable";
import ProductForm from "./components/ProductForm";
import CategoryManager from "./components/CategoryManager";

export default function AdminPage() {
  const { products, content, saveContent, deleteProduct, loading } = useStore();

  const [activeTab, setActiveTab] = useState<"products" | "categories" | "content">("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ÉTATS LOCAUX FORMULAIRES DE CONTENU
  const [heroForm, setHeroForm] = useState({
    badge: "Nouvelle Saison 2026",
    title: "BIENVENUE CHEZ ANZY",
    subtitle: "Découvrez notre collection exclusive.",
    buttonText: "Découvrir la collection",
    cta: "Découvrir la collection",
    images: [] as string[],
  });

  const [aboutForm, setAboutForm] = useState({
    title: "À Propos d'Anzy Collection",
    subtitle: "L'ÉLÉGANCE AU FÉMININ",
    description: "",
    paragraph1: "",
    paragraph2: "",
    founderName: "Anzy",
    founderRole: "Fondatrice",
    quote: "Sublimer la beauté naturelle de chaque femme avec élégance et confort.",
    image: "",
  });

  const [footerForm, setFooterForm] = useState({
    brandName: "ANZY COLLECTION",
    tagline: "L'élégance et la qualité au quotidien.",
    copyright: "© 2026 Anzy Collection. Tous droits réservés.",
    whatsapp: "+22900000000",
  });

  const [socialForm, setSocialForm] = useState({
    instagram: "",
    facebook: "",
    tiktok: "",
    whatsapp: "",
  });

  // Charger le contenu existant dans les formulaires
  useEffect(() => {
    if (content) {
      if (content.hero) {
        setHeroForm({
          badge: content.hero.badge || "Nouvelle Saison 2026",
          title: content.hero.title || "BIENVENUE CHEZ ANZY",
          subtitle: content.hero.subtitle || "Découvrez notre collection exclusive.",
          buttonText: content.hero.buttonText || "Découvrir la collection",
          cta: content.hero.cta || content.hero.buttonText || "Découvrir la collection",
          images: content.hero.images || [],
        });
      }

      if (content.about) {
        setAboutForm({
          title: content.about.title || "À Propos d'Anzy Collection",
          subtitle: content.about.subtitle || "L'ÉLÉGANCE AU FÉMININ",
          description: content.about.description || "",
          paragraph1: content.about.paragraph1 || content.about.description || "",
          paragraph2: content.about.paragraph2 || "",
          founderName: content.about.founderName || "Anzy",
          founderRole: content.about.founderRole || "Fondatrice",
          quote: content.about.quote || "Sublimer la beauté naturelle de chaque femme.",
          image: content.about.image || "",
        });
      }

      if (content.footer) {
        setFooterForm({
          brandName: content.footer.brandName || "ANZY COLLECTION",
          tagline: content.footer.tagline || "L'élégance et la qualité au quotidien.",
          copyright: content.footer.copyright || "© 2026 Anzy Collection. Tous droits réservés.",
          whatsapp: content.footer.whatsapp || "+22900000000",
        });
      }

      if (content.social) {
        setSocialForm({
          instagram: content.social.instagram || "",
          facebook: content.social.facebook || "",
          tiktok: content.social.tiktok || "",
          whatsapp: content.social.whatsapp || "",
        });
      }
    }
  }, [content]);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleSaveProduct = async () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSaveContentSections = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedContent: StoreContent = {
      ...content,
      hero: heroForm,
      about: aboutForm,
      footer: footerForm,
      social: socialForm,
    };
    await saveContent(updatedContent);
    alert("Contenu du site mis à jour avec succès !");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F5] text-[#2C2224]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2C2224]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2C2224] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* EN-TÊTE ADMIN */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold block">
              Backoffice
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold">Panneau d'administration</h1>
          </div>

          <div className="flex flex-wrap gap-2 bg-[#FAF7F5] p-1.5 rounded-2xl border border-gray-100">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === "products"
                  ? "bg-[#2C2224] text-white shadow-md"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              🛍️ Produits ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === "categories"
                  ? "bg-[#2C2224] text-white shadow-md"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              🏷️ Catégories
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === "content"
                  ? "bg-[#2C2224] text-white shadow-md"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              🎨 Contenu Site
            </button>
          </div>
        </div>

        {/* ONGLET 1 : PRODUITS */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {!isFormOpen ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-serif font-bold">Catalogue Produits</h2>
                  <button
                    onClick={handleAddNewProduct}
                    className="bg-[#2C2224] hover:bg-[#E88D9E] text-white px-5 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all"
                  >
                    + Ajouter une création
                  </button>
                </div>
                <ProductTable
                  products={products}
                  onEdit={handleEditProduct}
                  onDelete={deleteProduct}
                />
              </>
            ) : (
              <div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="mb-4 text-xs font-mono text-gray-500 hover:text-black flex items-center gap-1"
                >
                  ← Retour au catalogue
                </button>
                <ProductForm editingProduct={editingProduct} onSave={handleSaveProduct} />
              </div>
            )}
          </div>
        )}

        {/* ONGLET 2 : CATÉGORIES */}
        {activeTab === "categories" && (
          <div className="max-w-2xl">
            <CategoryManager />
          </div>
        )}

        {/* ONGLET 3 : CONTENU DU SITE */}
        {activeTab === "content" && (
          <form onSubmit={handleSaveContentSections} className="space-y-8 max-w-4xl">
            
            {/* SECTION HERO */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-serif font-bold border-b pb-3 border-gray-100">
                1. Bannière d'accueil (Hero)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">Badge Haute Page</label>
                  <input
                    type="text"
                    value={heroForm.badge}
                    onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                    className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">Titre Principal</label>
                  <input
                    type="text"
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">Sous-titre</label>
                <input
                  type="text"
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">Texte du bouton CTA</label>
                <input
                  type="text"
                  value={heroForm.buttonText}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, buttonText: e.target.value, cta: e.target.value })
                  }
                  className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">
                  Images Carrousel (Séparées par des virgules)
                </label>
                <input
                  type="text"
                  value={(heroForm.images || []).join(", ")}
                  onChange={(e) =>
                    setHeroForm({
                      ...heroForm,
                      images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white"
                  placeholder="/images/hero1.jpg, /images/hero2.jpg"
                />
              </div>
            </div>

            {/* SECTION À PROPOS */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-serif font-bold border-b pb-3 border-gray-100">
                2. Section À Propos
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">Surtitre</label>
                  <input
                    type="text"
                    value={aboutForm.subtitle}
                    onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })}
                    className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">Titre Section</label>
                  <input
                    type="text"
                    value={aboutForm.title}
                    onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                    className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">Paragraphe 1</label>
                <textarea
                  value={aboutForm.paragraph1}
                  onChange={(e) =>
                    setAboutForm({
                      ...aboutForm,
                      paragraph1: e.target.value,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">Paragraphe 2</label>
                <textarea
                  value={aboutForm.paragraph2}
                  onChange={(e) => setAboutForm({ ...aboutForm, paragraph2: e.target.value })}
                  rows={3}
                  className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">Nom Fondatrice</label>
                  <input
                    type="text"
                    value={aboutForm.founderName}
                    onChange={(e) => setAboutForm({ ...aboutForm, founderName: e.target.value })}
                    className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">Rôle Fondatrice</label>
                  <input
                    type="text"
                    value={aboutForm.founderRole}
                    onChange={(e) => setAboutForm({ ...aboutForm, founderRole: e.target.value })}
                    className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">Citation</label>
                <input
                  type="text"
                  value={aboutForm.quote}
                  onChange={(e) => setAboutForm({ ...aboutForm, quote: e.target.value })}
                  className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* SECTION PIED DE PAGE & RESEAUX */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-serif font-bold border-b pb-3 border-gray-100">
                3. Footer & Réseaux Sociaux
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">WhatsApp Officiel</label>
                  <input
                    type="text"
                    value={footerForm.whatsapp}
                    onChange={(e) =>
                      setFooterForm({ ...footerForm, whatsapp: e.target.value })
                    }
                    className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={socialForm.instagram}
                    onChange={(e) =>
                      setSocialForm({ ...socialForm, instagram: e.target.value })
                    }
                    className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2C2224] hover:bg-[#E88D9E] text-white py-4 rounded-2xl text-xs font-mono uppercase tracking-widest font-bold shadow-xl transition-all"
            >
              💾 Sauvegarder les modifications du site
            </button>
          </form>
        )}
      </div>
    </div>
  );
}