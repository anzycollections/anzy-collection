"use client";

import { useState, useRef, useEffect } from "react";

interface LookbookItem {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

export default function LookbookTab({ content, saveContent }: { content: any; saveContent: (c: any) => void }) {
  const [items, setItems] = useState<LookbookItem[]>(content?.lookbook || []);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (content?.lookbook) setItems(content.lookbook); }, [content?.lookbook]);

  const save = async () => {
    setSaving(true);
    setSaveError(false);
    try {
      await saveContent({ ...content, lookbook: items });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (items.length + files.length > 6) {
      alert("Maximum 6 bannières pour garder une section lisible.");
      return;
    }
    let loaded = 0;
    const newItems: LookbookItem[] = [];
    Array.from(files).forEach((f) => {
      const r = new FileReader();
      r.onloadend = () => {
        newItems.push({ id: `lb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, imageUrl: r.result as string, title: "", subtitle: "", link: "" });
        loaded++;
        if (loaded === files.length) setItems((prev) => [...prev, ...newItems]);
      };
      r.readAsDataURL(f);
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const updateItem = (id: string, fields: Partial<LookbookItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...fields } : it)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const moveItem = (id: string, direction: -1 | 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      const newIdx = idx + direction;
      if (idx === -1 || newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="border-b border-gray-100 pb-3">
        <span className="text-[9px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold">SECTION 09</span>
        <h2 className="text-xl font-serif font-bold text-[#2C2224]">Lookbook / Bannières éditoriales</h2>
        <p className="text-[11px] text-gray-400 mt-1">
          Section libre entre le Catalogue et les Pièces Iconiques — idéale pour des photos d'ambiance, sans être liées à un produit précis.
        </p>
      </div>

      <div>
        <input type="file" accept="image/*" ref={fileRef} onChange={handleAddImage} className="hidden" multiple />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={items.length >= 6}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#E88D9E] bg-[#FAF7F5] transition flex items-center justify-center gap-2 text-gray-400 text-xs font-mono uppercase tracking-widest cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          + Ajouter une image ({items.length}/6)
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={item.id} className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-[#FAF7F5]/50">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shrink-0">
              <img src={item.imageUrl} alt={item.title || "Lookbook"} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              <input
                type="text"
                placeholder="Titre (optionnel)"
                value={item.title || ""}
                onChange={(e) => updateItem(item.id, { title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Sous-titre (optionnel)"
                value={item.subtitle || ""}
                onChange={(e) => updateItem(item.id, { subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Lien au clic (optionnel, ex: #catalog)"
                value={item.link || ""}
                onChange={(e) => updateItem(item.id, { link: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none"
              />
            </div>
            <div className="flex flex-col justify-between items-end shrink-0">
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center text-xs cursor-pointer transition"
                title="Supprimer"
              >
                ✕
              </button>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveItem(item.id, -1)}
                  disabled={idx === 0}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Monter"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(item.id, 1)}
                  disabled={idx === items.length - 1}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Descendre"
                >
                  ↓
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-[11px] font-mono text-gray-400 italic text-center py-4">Aucune bannière pour le moment.</p>
        )}
      </div>

      <button
        onClick={save}
        className={`w-full py-4 rounded-2xl text-[11px] font-mono font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer ${
          saved ? "bg-green-600 text-white scale-102" : "bg-[#2C2224] text-white hover:bg-black"
        }`}
      >
        {saved ? "✓ MODIFICATIONS ENREGISTRÉES" : "ENREGISTRER LE LOOKBOOK"}
      </button>
    </div>
  );
}
