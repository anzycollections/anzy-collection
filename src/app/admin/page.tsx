"use client";

import { useState, useRef, useEffect } from "react";
import { Product, useStore } from "@/context/StoreContext";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import CategoryManager from "./components/CategoryManager";

type Tab = "products" | "categories" | "hero" | "about" | "footer";

export default function AdminPage() {
  const { content, saveContent } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const heroFileRef = useRef<HTMLInputElement>(null);
  const aboutFileRef = useRef<HTMLInputElement>(null);

  // Récupération sécurisée du tableau de produits (Support de 'produits' ou 'products')
  const productList: Product[] = content?.produits || content?.products || [];

  const [heroForm, setHeroForm] = useState(content?.hero || { badge: "", title: "", subtitle: "", cta: "", images: [] });
  const [aboutForm, setAboutForm] = useState(content?.about || { subtitle: "", title: "", paragraph1: "", paragraph2: "", image: "", stats: [] });
  const [footerForm, setFooterForm] = useState(content?.footer || { copyright: "" });
  const [socialForm, setSocialForm] = useState(content?.social || { instagram: "", tiktok: "", facebook: "" });

  const [heroSaved, setHeroSaved] = useState(false);
  const [aboutSaved, setAboutSaved] = useState(false);
  const [footerSaved, setFooterSaved] = useState(false);

  useEffect(() => { if (content?.hero) setHeroForm(content.hero); }, [content?.hero]);
  useEffect(() => { if (content?.about) setAboutForm(content.about); }, [content?.about]);
  useEffect(() => { if (content?.footer) setFooterForm(content.footer); }, [content?.footer]);
  useEffect(() => { if (content?.social) setSocialForm(content.social); }, [content?.social]);

  // Filtrage sécurisé des produits
  const filtered = productList.filter((p: Product) =>
    p?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sauvegarde des produits (Garde la clé 'produits' du Store)
  const handleSaveProduct = (productData: Product) => {
    let updatedProducts: Product[];
    
    if (editingProduct) {
      updatedProducts = productList.map((p) => (p.id === editingProduct.id ? productData : p));
    } else {
      updatedProducts = [...productList, { ...productData, id: productData.id || Date.now().toString() }];
    }

    saveContent({
      ...content,
      produits: updatedProducts,
    });

    setShowForm(false);
    setEditingProduct(null);
  };

  // Suppression d'un produit
  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = productList.filter((p) => p.id !== productId);
    saveContent({
      ...content,
      produits: updatedProducts,
    });
  };

  const saveHero = () => {
    saveContent({ ...content, hero: heroForm });
    setHeroSaved(true);
    setTimeout(() => setHeroSaved(false), 2000);
  };

  const saveAbout = () => {
    saveContent({ ...content, about: aboutForm });
    setAboutSaved(true);
    setTimeout(() => setAboutSaved(false), 2000);
  };

  const saveFooter = () => {
    saveContent({ ...content, footer: footerForm, social: socialForm });
    setFooterSaved(true);
    setTimeout(() => setFooterSaved(false), 2000);
  };

  const handleHeroImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files) return;
    const current = heroForm.images || [];
    if (current.length + files.length > 5) return;
    let loaded = 0; const newImgs: string[] = [];
    Array.from(files).forEach((f) => {
      const r = new FileReader();
      r.onloadend = () => {
        newImgs.push(r.result as string);
        loaded++;
        if (loaded === files.length) setHeroForm({ ...heroForm, images: [...current, ...newImgs] });
      };
      r.readAsDataURL(f);
    });
  };

  const handleAboutImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onloadend = () => setAboutForm({ ...aboutForm, image: r.result as string });
    r.readAsDataURL(file);
  };

  const tabs = [
    { id: "products", label: "PRODUITS", code: "01" },
    { id: "categories", label: "CATÉGORIES", code: "02" },
    { id: "hero", label: "SECTION HERO", code: "03" },
    { id: "about", label: "À PROPOS", code: "04" },
    { id: "footer", label: "PIED DE PAGE", code: "05" },
  ];

  const SaveButton = ({ saved, onClick, label }: { saved: boolean; onClick: () => void; label: string }) => (
    <button
      onClick={onClick}
      className={`w-full py-4 rounded-2xl text-[11px] font-mono font-bold uppercase tracking-widest transition-all duration-300 shadow-md ${
        saved ? "bg-green-600 text-white scale-102" : "bg-[#2C2224] text-white hover:bg-black"
      }`}
    >
      {saved ? "✓ MODIFICATIONS ENREGISTRÉES" : `ENREGISTRER ${label}`}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F5] p-4 sm:p-6 lg:p-10 text-[#2C2224] pb-28">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* EN-TÊTE ADMIN */}
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

        {/* ONGLETS */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-200/60">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`px-5 py-3 rounded-2xl text-[10px] font-mono tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-200 border flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-[#2C2224] text-white border-[#2C2224] shadow-md font-bold"
                    : "bg-white/80 text-gray-500 border-gray-200/80 hover:border-[#E88D9E] hover:text-[#2C2224]"
                }`}
              >
                <span className={`text-[9px] ${isActive ? "text-[#E88D9E]" : "text-gray-400"}`}>{tab.code}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ONGLET PRODUITS */}
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

            {/* Formulaire de création / édition */}
            {showForm && (
              <ProductForm
                editingProduct={editingProduct}
                onSave={handleSaveProduct}
              />
            )}

            {/* Tableau récapitulatif */}
            <ProductTable
              products={filtered}
              onEdit={(p: Product) => { setEditingProduct(p); setShowForm(true); }}
              onDelete={handleDeleteProduct}
            />
          </div>
        )}

        {/* ONGLET CATÉGORIES */}
        {activeTab === "categories" && <CategoryManager />}

        {/* ONGLET HERO */}
        {activeTab === "hero" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <span className="text-[9px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold">SECTION 03</span>
              <h2 className="text-xl font-serif font-bold text-[#2C2224]">Bannière d'Accueil (Hero)</h2>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Badge d'accroche</label>
              <input type="text" value={heroForm.badge} onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Titre principal</label>
              <input type="text" value={heroForm.title} onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Sous-titre descriptif</label>
              <textarea value={heroForm.subtitle} onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs h-20 focus:border-[#E88D9E] focus:outline-none resize-none" />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Texte du bouton principal (CTA)</label>
              <input type="text" value={heroForm.cta} onChange={(e) => setHeroForm({ ...heroForm, cta: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-2">Visuels carrousel (max 5)</label>
              <input type="file" accept="image/*" ref={heroFileRef} onChange={handleHeroImages} className="hidden" multiple />

              <div className="flex flex-wrap gap-3">
                {(heroForm.images || []).map((img: string, i: number) => (
                  <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                    <img src={img} alt="Hero" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setHeroForm({ ...heroForm, images: heroForm.images.filter((_: string, j: number) => j !== i) })} 
                      className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {(heroForm.images || []).length < 5 && (
                  <div onClick={() => heroFileRef.current?.click()} className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#E88D9E] bg-[#FAF7F5] transition">
                    <span className="text-xl text-gray-400">+</span>
                  </div>
                )}
              </div>
            </div>

            <SaveButton saved={heroSaved} onClick={saveHero} label="SECTION HERO" />
          </div>
        )}

        {/* ONGLET À PROPOS */}
        {activeTab === "about" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <span className="text-[9px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold">SECTION 04</span>
              <h2 className="text-xl font-serif font-bold text-[#2C2224]">Présentation de la Maison (À Propos)</h2>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Sous-titre d'en-tête</label>
              <input type="text" value={aboutForm.subtitle} onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Titre de section</label>
              <input type="text" value={aboutForm.title} onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Paragraphe 1</label>
              <textarea value={aboutForm.paragraph1} onChange={(e) => setAboutForm({ ...aboutForm, paragraph1: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs h-20 focus:border-[#E88D9E] focus:outline-none resize-none" />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Paragraphe 2</label>
              <textarea value={aboutForm.paragraph2} onChange={(e) => setAboutForm({ ...aboutForm, paragraph2: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs h-20 focus:border-[#E88D9E] focus:outline-none resize-none" />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-2">Visuel officiel</label>
              <input type="file" accept="image/*" ref={aboutFileRef} onChange={handleAboutImage} className="hidden" />
              <div onClick={() => aboutFileRef.current?.click()} className="w-full h-36 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#E88D9E] bg-[#FAF7F5] transition">
                {aboutForm.image ? <img src={aboutForm.image} alt="About" className="max-h-full rounded-xl" /> : <span className="text-xs font-mono uppercase text-gray-400">Importer l'image</span>}
              </div>
            </div>

            <SaveButton saved={aboutSaved} onClick={saveAbout} label="SECTION À PROPOS" />
          </div>
        )}

        {/* ONGLET FOOTER */}
        {activeTab === "footer" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-2">
                <span className="text-[9px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold">SECTION 05</span>
                <h2 className="text-xl font-serif font-bold text-[#2C2224]">Pied de Page (Footer)</h2>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">© Mentions Légales / Copyright</label>
                <input type="text" value={footerForm.copyright} onChange={(e) => setFooterForm({ ...footerForm, copyright: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-lg font-serif font-bold border-b border-gray-100 pb-2">Réseaux Sociaux Officiels</h2>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Instagram URL</label>
                <input type="url" value={socialForm.instagram} onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" placeholder="https://instagram.com/..." />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">TikTok URL</label>
                <input type="url" value={socialForm.tiktok} onChange={(e) => setSocialForm({ ...socialForm, tiktok: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" placeholder="https://tiktok.com/..." />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Facebook URL</label>
                <input type="url" value={socialForm.facebook} onChange={(e) => setSocialForm({ ...socialForm, facebook: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" placeholder="https://facebook.com/..." />
              </div>
              <SaveButton saved={footerSaved} onClick={saveFooter} label="CONFIGURATION DU FOOTER" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}