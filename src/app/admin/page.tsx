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

  const [heroForm, setHeroForm] = useState(content.hero);
  const [aboutForm, setAboutForm] = useState(content.about);
  const [footerForm, setFooterForm] = useState(content.footer);
  const [socialForm, setSocialForm] = useState(content.social);

  // États des boutons
  const [heroSaved, setHeroSaved] = useState(false);
  const [aboutSaved, setAboutSaved] = useState(false);
  const [footerSaved, setFooterSaved] = useState(false);

  useEffect(() => { setHeroForm(content.hero); }, [content.hero]);
  useEffect(() => { setAboutForm(content.about); }, [content.about]);
  useEffect(() => { setFooterForm(content.footer); }, [content.footer]);
  useEffect(() => { setSocialForm(content.social); }, [content.social]);

  const filtered = content.products.filter((p: Product) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
    Array.from(files).forEach(f => {
      const r = new FileReader();
      r.onloadend = () => { newImgs.push(r.result as string); loaded++; if (loaded === files.length) setHeroForm({...heroForm, images: [...current, ...newImgs]}); };
      r.readAsDataURL(f);
    });
  };

  const handleAboutImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onloadend = () => setAboutForm({...aboutForm, image: r.result as string});
    r.readAsDataURL(file);
  };

  const tabs = ["products", "categories", "hero", "about", "footer"] as Tab[];

  // Bouton sauvegarde animé
  const SaveButton = ({ saved, onClick, label }: { saved: boolean; onClick: () => void; label: string }) => (
    <button onClick={onClick}
      className={`w-full py-3 rounded-2xl text-xs font-bold uppercase transition-all duration-300 ${
        saved ? "bg-green-500 text-white scale-105" : "bg-[#E88D9E] text-white hover:bg-[#d67b8c]"
      }`}>
      {saved ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
          Sauvegardé !
        </span>
      ) : `💾 ${label}`}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F5] p-4 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-[#E88D9E]/20 pb-4">
          <div><span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase block">Administration</span><h1 className="text-2xl font-serif font-bold">Panneau de contrôle</h1></div>
          <a href="/" target="_blank" className="text-xs text-[#E88D9E] hover:underline">👁️ Voir le site →</a>
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${activeTab === tab ? "bg-[#E88D9E] text-white" : "bg-white border"}`}>
              {tab === "products" ? "🛍️ Produits" : tab === "categories" ? "📂 Catégories" : tab === "hero" ? "🖼️ Hero" : tab === "about" ? "📖 À propos" : "👣 Footer"}
            </button>
          ))}
        </div>

        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <input type="text" placeholder="🔍 Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="px-4 py-2 rounded-full border text-sm w-48" />
              <button onClick={() => { setEditingProduct(null); setShowForm(!showForm); }} className="bg-[#E88D9E] text-white px-4 py-2 rounded-full text-xs">{showForm ? "✕" : "+ Nouveau"}</button>
            </div>
            {showForm && <ProductForm editingProduct={editingProduct} onSave={() => { setShowForm(false); setEditingProduct(null); }} />}
            <ProductTable products={filtered} onEdit={(p: Product) => { setEditingProduct(p); setShowForm(true); }} />
          </div>
        )}

        {activeTab === "categories" && <CategoryManager />}

        {activeTab === "hero" && (
          <div className="bg-white rounded-3xl p-6 border space-y-4">
            <h2 className="text-lg font-serif font-bold">Section Hero</h2>
            <div><label className="text-[10px] font-mono uppercase text-gray-500">🏷️ Badge</label><input type="text" value={heroForm.badge} onChange={e => setHeroForm({...heroForm, badge: e.target.value})} className="w-full px-3 py-2 rounded-xl border text-sm" /></div>
            <div><label className="text-[10px] font-mono uppercase text-gray-500">📝 Titre</label><input type="text" value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} className="w-full px-3 py-2 rounded-xl border text-sm" /></div>
            <div><label className="text-[10px] font-mono uppercase text-gray-500">📄 Sous-titre</label><textarea value={heroForm.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} className="w-full px-3 py-2 rounded-xl border text-sm h-20" /></div>
            <div><label className="text-[10px] font-mono uppercase text-gray-500">🔘 Bouton</label><input type="text" value={heroForm.cta} onChange={e => setHeroForm({...heroForm, cta: e.target.value})} className="w-full px-3 py-2 rounded-xl border text-sm" /></div>
            <div><label className="text-[10px] font-mono uppercase text-gray-500 block mb-2">🖼️ Images (max 5)</label><input type="file" accept="image/*" ref={heroFileRef} onChange={handleHeroImages} className="hidden" multiple />
              <div className="flex flex-wrap gap-3">{(heroForm.images||[]).map((img,i)=><div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border"><img src={img} className="w-full h-full object-cover"/><button onClick={()=>setHeroForm({...heroForm,images:heroForm.images.filter((_,j)=>j!==i)})} className="absolute top-0 right-0 bg-red-400 text-white w-5 h-5 rounded-full text-[10px]">✕</button></div>)}{(heroForm.images||[]).length<5&&<div onClick={()=>heroFileRef.current?.click()} className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#E88D9E] bg-gray-50"><span className="text-2xl text-gray-400">+</span></div>}</div>
            </div>
            <SaveButton saved={heroSaved} onClick={saveHero} label="Sauvegarder Hero" />
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-white rounded-3xl p-6 border space-y-4">
            <h2 className="text-lg font-serif font-bold">Section À propos</h2>
            <div><label className="text-[10px] font-mono uppercase text-gray-500">🏷️ Sous-titre</label><input type="text" value={aboutForm.subtitle} onChange={e=>setAboutForm({...aboutForm,subtitle:e.target.value})} className="w-full px-3 py-2 rounded-xl border text-sm"/></div>
            <div><label className="text-[10px] font-mono uppercase text-gray-500">📝 Titre</label><input type="text" value={aboutForm.title} onChange={e=>setAboutForm({...aboutForm,title:e.target.value})} className="w-full px-3 py-2 rounded-xl border text-sm"/></div>
            <div><label className="text-[10px] font-mono uppercase text-gray-500">📄 Paragraphe 1</label><textarea value={aboutForm.paragraph1} onChange={e=>setAboutForm({...aboutForm,paragraph1:e.target.value})} className="w-full px-3 py-2 rounded-xl border text-sm h-20"/></div>
            <div><label className="text-[10px] font-mono uppercase text-gray-500">📄 Paragraphe 2</label><textarea value={aboutForm.paragraph2} onChange={e=>setAboutForm({...aboutForm,paragraph2:e.target.value})} className="w-full px-3 py-2 rounded-xl border text-sm h-20"/></div>
            <div><label className="text-[10px] font-mono uppercase text-gray-500 block mb-2">🖼️ Image</label><input type="file" accept="image/*" ref={aboutFileRef} onChange={handleAboutImage} className="hidden"/><div onClick={()=>aboutFileRef.current?.click()} className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#E88D9E] bg-gray-50">{aboutForm.image?<img src={aboutForm.image} className="max-h-full rounded-xl"/>:<div className="text-center text-gray-400"><span className="text-3xl">📷</span></div>}</div></div>
            <SaveButton saved={aboutSaved} onClick={saveAbout} label="Sauvegarder" />
          </div>
        )}

        {activeTab === "footer" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border space-y-4">
              <h2 className="text-lg font-serif font-bold">Footer</h2>
              <div><label className="text-[10px] font-mono uppercase text-gray-500">© Copyright</label><input type="text" value={footerForm.copyright} onChange={e=>setFooterForm({...footerForm,copyright:e.target.value})} className="w-full px-3 py-2 rounded-xl border text-sm"/></div>
            </div>
            <div className="bg-white rounded-3xl p-6 border space-y-4">
              <h2 className="text-lg font-serif font-bold">Réseaux Sociaux</h2>
              <div><label className="text-[10px] font-mono uppercase text-gray-500">📸 Instagram</label><input type="url" value={socialForm.instagram} onChange={e=>setSocialForm({...socialForm,instagram:e.target.value})} className="w-full px-3 py-2 rounded-xl border text-sm"/></div>
              <div><label className="text-[10px] font-mono uppercase text-gray-500">🎵 TikTok</label><input type="url" value={socialForm.tiktok} onChange={e=>setSocialForm({...socialForm,tiktok:e.target.value})} className="w-full px-3 py-2 rounded-xl border text-sm"/></div>
              <div><label className="text-[10px] font-mono uppercase text-gray-500">📘 Facebook</label><input type="url" value={socialForm.facebook} onChange={e=>setSocialForm({...socialForm,facebook:e.target.value})} className="w-full px-3 py-2 rounded-xl border text-sm"/></div>
              <SaveButton saved={footerSaved} onClick={saveFooter} label="Sauvegarder" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
