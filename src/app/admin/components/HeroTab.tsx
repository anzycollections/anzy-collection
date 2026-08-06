"use client";

import { useState, useRef, useEffect } from "react";

export default function HeroTab({ content, saveContent }: { content: any; saveContent: (c: any) => void }) {
  const [heroForm, setHeroForm] = useState(content?.hero || { badge: "", title: "", subtitle: "", buttonText: "", images: [] });
  const [heroSaved, setHeroSaved] = useState(false);
  const heroFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (content?.hero) setHeroForm(content.hero); }, [content?.hero]);

  const saveHero = () => {
    saveContent({ ...content, hero: heroForm });
    setHeroSaved(true);
    setTimeout(() => setHeroSaved(false), 2000);
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

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
      <div className="border-b border-gray-100 pb-3">
        <span className="text-[9px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold">SECTION 04</span>
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
        <input type="text" value={heroForm.buttonText} onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" />
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
                onClick={() => setHeroForm({ ...heroForm, images: (heroForm.images || []).filter((_: string, j: number) => j !== i) })} 
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
      <button
        onClick={saveHero}
        className={`w-full py-4 rounded-2xl text-[11px] font-mono font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer ${
          heroSaved ? "bg-green-600 text-white scale-102" : "bg-[#2C2224] text-white hover:bg-black"
        }`}
      >
        {heroSaved ? "✓ MODIFICATIONS ENREGISTRÉES" : "ENREGISTRER SECTION HERO"}
      </button>
    </div>
  );
}
