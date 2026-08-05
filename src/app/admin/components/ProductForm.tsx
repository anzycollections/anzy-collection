"use client";

import { useState, useRef } from "react";
import { Product, VarianteOption, VarianteCombi, useStore } from "@/context/StoreContext";

interface Props { editingProduct: Product | null; onSave: () => void; }

export default function ProductForm({ editingProduct, onSave }: Props) {
  const { content, saveContent } = useStore();
  const mainImageRef = useRef<HTMLInputElement>(null);

  const init: Product = editingProduct || {
    id: "", brand: "ANZY COLLECTION", name: "", category: "gaines", badge: "Nouveauté",
    description: "", price: 0, currency: "XOF", material: "", sizes: [],
    colors: [], images: [], stock: 0, visible: true,
    options: [] as VarianteOption[],
    variantes: [] as VarianteCombi[],
  };

  const [form, setForm] = useState({
    brand: init.brand, name: init.name, category: init.category, badge: init.badge,
    description: init.description, price: init.price, currency: init.currency,
    material: init.material, sizes: (init.sizes || []).join(", "),
    images: init.images || [], stock: init.stock, visible: init.visible,
    options: init.options || [],
    variantes: init.variantes || [],
  });

  const [newOptionName, setNewOptionName] = useState("");
  const [newValueInputs, setNewValueInputs] = useState<Record<number, string>>({});
  const [uploadingMain, setUploadingMain] = useState(false);

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploadingMain(true);
    const r = new FileReader();
    r.onloadend = () => { setForm({...form, images: [r.result as string, ...form.images.slice(1)]}); setUploadingMain(false); };
    r.readAsDataURL(f);
  };

  const addOption = (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); // Empêche la soumission du formulaire
    if (!newOptionName.trim() || form.options.length >= 3) return;
    setForm({...form, options: [...form.options, { name: newOptionName.trim(), values: [] }]});
    setNewOptionName("");
  };

  const removeOption = (idx: number) => { 
    setForm({...form, options: form.options.filter((_, i) => i !== idx)}); 
  };

  const addValue = (optIdx: number, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault(); // Empêche la soumission du formulaire
    const val = newValueInputs[optIdx]?.trim(); if (!val) return;
    const opts = [...form.options];
    if (!opts[optIdx].values.includes(val)) { 
      opts[optIdx].values.push(val); 
      setForm({...form, options: opts}); 
    }
    setNewValueInputs({...newValueInputs, [optIdx]: ""});
  };

  const removeValue = (optIdx: number, valIdx: number) => {
    const opts = [...form.options]; 
    opts[optIdx].values.splice(valIdx, 1); 
    setForm({...form, options: opts});
  };

  const generateVariantes = (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); // Empêche la soumission du formulaire
    if (form.options.length === 0 || form.options.some(o => o.values.length === 0)) return;
    const combos: VarianteCombi[] = [];
    const recurse = (idx: number, current: Record<string, string>) => {
      if (idx === form.options.length) { 
        combos.push({ 
          id: "v" + Date.now() + Math.random().toString(36).substr(2, 4), 
          combo: { ...current }, 
          price: form.price, 
          stock: form.stock || 10, 
          image: form.images[0] || "", 
          active: true 
        }); 
        return; 
      }
      form.options[idx].values.forEach(v => recurse(idx + 1, { ...current, [form.options[idx].name]: v }));
    };
    recurse(0, {}); 
    setForm({ ...form, variantes: combos });
  };

  const updateVariante = (id: string, field: string, value: any) => { 
    setForm({ ...form, variantes: form.variantes.map(v => v.id === id ? { ...v, [field]: value } : v) }); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: editingProduct?.id || "p" + Date.now(), 
      brand: form.brand, 
      name: form.name, 
      category: form.category,
      badge: form.badge, 
      description: form.description, 
      price: Number(form.price), 
      currency: form.currency,
      material: form.material, 
      sizes: form.sizes.split(",").map(s => s.trim()).filter(Boolean),
      colors: [], 
      images: form.images, 
      stock: Number(form.stock), 
      visible: form.visible,
      options: form.options, 
      variantes: form.variantes.filter(v => v.active),
    };

    const products = editingProduct 
      ? content.products.map(p => p.id === product.id ? product : p) 
      : [...content.products, product];

    saveContent({ ...content, products }); 
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border space-y-6">
      <h2 className="text-lg font-serif font-bold">{editingProduct ? "Modifier le produit" : "Nouveau produit"}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-500">Nom du produit *</label>
          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" placeholder="Ex: Prothèse Silicone 3-en-1" required />
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-500">Marque</label>
          <input type="text" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" placeholder="Ex: ANZY COLLECTION" />
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-500">Catégorie</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm">
            {content.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* IMAGE PRINCIPALE */}
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-500 block mb-1">📸 Image principale</label>
          <input type="file" accept="image/*" ref={mainImageRef} onChange={handleMainImage} className="hidden" />
          <div onClick={() => mainImageRef.current?.click()} className="w-full h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#E88D9E] transition bg-gray-50">
            {uploadingMain ? <div className="w-6 h-6 border-2 border-[#E88D9E] border-t-transparent rounded-full animate-spin" /> :
              form.images[0] ? <img src={form.images[0]} className="max-h-full max-w-full object-contain rounded-xl" /> :
              <span className="text-2xl text-gray-400">+</span>}
          </div>
        </div>

        {/* PRIX ET STOCK SANS LE BUG DU 0 */}
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-500">Prix de base (F CFA)</label>
          <input 
            type="number" 
            value={form.price === 0 ? "" : form.price} 
            onChange={e => setForm({ ...form, price: e.target.value === "" ? 0 : Number(e.target.value) })} 
            className="w-full px-3 py-2 rounded-xl border text-sm" 
            placeholder="Ex: 50000" 
          />
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-500">Stock</label>
          <input 
            type="number" 
            value={form.stock === 0 ? "" : form.stock} 
            onChange={e => setForm({ ...form, stock: e.target.value === "" ? 0 : Number(e.target.value) })} 
            className="w-full px-3 py-2 rounded-xl border text-sm" 
            placeholder="Ex: 25" 
          />
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-500">Badge</label>
          <select value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm">
            <option>Nouveauté</option>
            <option>Bestseller</option>
            <option>Tendance</option>
            <option>Incontournable</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-500">Matière</label>
          <input type="text" value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" placeholder="Ex: Silicone médical" />
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-500">Tailles</label>
          <input type="text" value={form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" placeholder="Ex: S, M, L" />
        </div>
        <div className="md:col-span-3">
          <label className="text-[10px] font-mono uppercase text-gray-500">Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm h-16" placeholder="Décrivez le produit..." />
        </div>
      </div>

      {/* BLOC OPTIONS (AVEC type="button" POUR ÉVITER DE FERMER LE FORMULAIRE) */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
        <label className="text-[10px] font-mono uppercase text-gray-500 block">Options du produit (max 3)</label>
        {form.options.map((opt, i) => (
          <div key={i} className="bg-white rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">{opt.name}</span>
              <button type="button" onClick={() => removeOption(i)} className="text-red-400 text-xs">Supprimer</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {opt.values.map((v, j) => (
                <span key={j} className="bg-[#FAF7F5] px-3 py-1 rounded-full text-xs border flex items-center gap-1">
                  {v}
                  <button type="button" onClick={() => removeValue(i, j)} className="text-red-400">✕</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newValueInputs[i] || ""} 
                onChange={e => setNewValueInputs({ ...newValueInputs, [i]: e.target.value })} 
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addValue(i); } }} 
                placeholder="Ex: Beige, Chair Clair, Chair Foncé" 
                className="flex-1 px-3 py-2 rounded-lg border text-xs" 
              />
              <button type="button" onClick={e => addValue(i, e)} className="px-4 py-2 bg-[#E88D9E] text-white rounded-lg text-xs font-bold">+</button>
            </div>
          </div>
        ))}

        {form.options.length < 3 && (
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newOptionName} 
              onChange={e => setNewOptionName(e.target.value)} 
              placeholder="Ex: Couleur, Poids, Contenance..." 
              className="flex-1 px-3 py-2 rounded-xl border text-xs" 
            />
            <button type="button" onClick={e => addOption(e)} className="px-4 py-2 bg-[#2C2224] text-white rounded-xl text-xs font-bold">+ Ajouter</button>
          </div>
        )}

        {form.options.length > 0 && (
          <button type="button" onClick={e => generateVariantes(e)} className="w-full py-2.5 bg-[#E88D9E] text-white rounded-xl text-xs font-bold uppercase">
            🔄 Générer les variantes
          </button>
        )}
      </div>

      {/* TABLEAU DES VARIANTES */}
      {form.variantes.length > 0 && (
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-500 block mb-2">{form.variantes.length} variante(s) générée(s)</label>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Actif</th>
                  <th className="p-2 text-left">Variante</th>
                  <th className="p-2 text-left">Prix</th>
                  <th className="p-2 text-left">Stock</th>
                </tr>
              </thead>
              <tbody>
                {form.variantes.map(v => (
                  <tr key={v.id} className={`border-t ${v.active ? "" : "opacity-40"}`}>
                    <td className="p-2">
                      <button type="button" onClick={() => updateVariante(v.id, "active", !v.active)} className={`w-8 h-5 rounded-full ${v.active ? "bg-green-500" : "bg-gray-300"}`}>
                        <span className={`block w-4 h-4 bg-white rounded-full transition ${v.active ? "ml-3.5" : "ml-0.5"}`} />
                      </button>
                    </td>
                    <td className="p-2 font-medium">{Object.values(v.combo).join(" / ")}</td>
                    <td className="p-2">
                      <input 
                        type="number" 
                        value={v.price === 0 ? "" : v.price} 
                        onChange={e => updateVariante(v.id, "price", e.target.value === "" ? 0 : Number(e.target.value))} 
                        className="w-20 px-2 py-1 rounded border text-xs" 
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="number" 
                        value={v.stock === 0 ? "" : v.stock} 
                        onChange={e => updateVariante(v.id, "stock", e.target.value === "" ? 0 : Number(e.target.value))} 
                        className="w-16 px-2 py-1 rounded border text-xs" 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="text-[10px] font-mono uppercase text-gray-500">Visible sur le site</label>
        <button type="button" onClick={() => setForm({ ...form, visible: !form.visible })} className={`w-12 h-6 rounded-full ${form.visible ? "bg-green-500" : "bg-gray-300"}`}>
          <span className={`block w-5 h-5 bg-white rounded-full transition ${form.visible ? "ml-6" : "ml-0.5"}`} />
        </button>
      </div>

      {/* SEUL ET UNIQUE BOUTON DE SOUMISSION DU FORMULAIRE */}
      <button type="submit" className="w-full bg-[#E88D9E] text-white py-3.5 rounded-2xl text-xs font-bold uppercase shadow-md hover:bg-[#d67b8c] transition">
        {editingProduct ? "💾 Mettre à jour" : "✨ Ajouter le produit"}
      </button>
    </form>
  );
}