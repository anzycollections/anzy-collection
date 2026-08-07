"use client";

import { useState, useRef, useEffect } from "react";

export default function AboutTab({ content, saveContent }: { content: any; saveContent: (c: any) => void }) {
  const [aboutForm, setAboutForm] = useState({
    subtitle: content?.about?.subtitle || "",
    title: content?.about?.title || "",
    founderName: content?.about?.founderName || "",
    founderRole: content?.about?.founderRole || "",
    quote: content?.about?.quote || "",
    description: content?.about?.description || "",
    image: content?.about?.image || "",
  });
  
  const [aboutSaved, setAboutSaved] = useState(false);
  const aboutFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { 
    if (content?.about) {
      setAboutForm({
        subtitle: content.about.subtitle || "",
        title: content.about.title || "",
        founderName: content.about.founderName || "",
        founderRole: content.about.founderRole || "",
        quote: content.about.quote || "",
        description: content.about.description || "",
        image: content.about.image || "",
      });
    } 
  }, [content?.about]);

  const saveAbout = () => {
    saveContent({ ...content, about: aboutForm });
    setAboutSaved(true);
    setTimeout(() => setAboutSaved(false), 2000);
  };

  const handleAboutImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onloadend = () => setAboutForm((prev) => ({ ...prev, image: r.result as string }));
    r.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
      <div className="border-b border-gray-100 pb-3">
        <span className="text-[9px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold">SECTION 05</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Nom de la fondatrice</label>
          <input type="text" value={aboutForm.founderName} onChange={(e) => setAboutForm({ ...aboutForm, founderName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Rôle de la fondatrice</label>
          <input type="text" value={aboutForm.founderRole} onChange={(e) => setAboutForm({ ...aboutForm, founderRole: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Citation</label>
        <textarea value={aboutForm.quote} onChange={(e) => setAboutForm({ ...aboutForm, quote: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs h-16 focus:border-[#E88D9E] focus:outline-none resize-none" />
      </div>
      <div>
        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Description</label>
        <textarea value={aboutForm.description} onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs h-20 focus:border-[#E88D9E] focus:outline-none resize-none" />
      </div>
      
      {/* NOUVELLE ZONE D'IMAGE AVEC BOUTON SUPPRIMER */}
      <div>
        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-2">Visuel officiel</label>
        <input type="file" accept="image/*" ref={aboutFileRef} onChange={handleAboutImage} className="hidden" />
        
        <div className="relative w-full h-36">
          <div onClick={() => aboutFileRef.current?.click()} className="w-full h-full rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#E88D9E] bg-[#FAF7F5] transition overflow-hidden">
            {aboutForm.image ? (
              <img src={aboutForm.image} alt="About" className="max-h-full rounded-xl" />
            ) : (
              <span className="text-xs font-mono uppercase text-gray-400">Importer l'image</span>
            )}
          </div>
          
          {/* LE BOUTON DE SUPPRESSION */}
          {aboutForm.image && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAboutForm({ ...aboutForm, image: "" });
                if (aboutFileRef.current) aboutFileRef.current.value = "";
              }}
              className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 transition cursor-pointer z-10 font-bold text-xs"
              title="Supprimer l'image"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <button
        onClick={saveAbout}
        className={`w-full py-4 rounded-2xl text-[11px] font-mono font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer ${
          aboutSaved ? "bg-green-600 text-white scale-102" : "bg-[#2C2224] text-white hover:bg-black"
        }`}
      >
        {aboutSaved ? "✓ MODIFICATIONS ENREGISTRÉES" : "ENREGISTRER SECTION À PROPOS"}
      </button>
    </div>
  );
}