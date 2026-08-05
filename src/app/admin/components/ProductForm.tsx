"use client";

import { useState, useRef, useEffect } from "react";
import { Product, VarianteOption, VarianteCombi, useStore } from "@/context/StoreContext";

interface Props { editingProduct: Product | null; onSave: () => void; }

export default function ProductForm({ editingProduct, onSave }: Props) {
  const { content, saveContent } = useStore();
  const mainImageRef = useRef<HTMLInputElement>(null);
  const varianteImageRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [form, setForm] = useState({
    brand: "ANZY COLLECTION",
    name: "",
    category: "gaines",
    badge: "Nouveauté",
    description: "",
    price: 0,
    currency: "XOF",
    material: "",
    sizes: "",
    images: [] as string[],
    stock: 0,
    visible: true,
    options: [] as VarianteOption[],
    variantes: [] as VarianteCombi[],
  });

  // Recharger et forcer la réhydratation lors de la modification d'un produit
  useEffect(() => {
    if (editingProduct) {
      setForm({
        brand: editingProduct.brand || "ANZY COLLECTION",
        name: editingProduct.name || "",
        category: editingProduct.category || "gaines",
        badge: editingProduct.badge || "Nouveauté",
        description: editingProduct.description || "",
        price: editingProduct.price || 0,
        currency: editingProduct.currency || "XOF",
        material: editingProduct.material || "",
        sizes: (editingProduct.sizes || []).join(", "),
        images: editingProduct.images || [],
        stock: editingProduct.stock || 0,
        visible: editingProduct.visible !== undefined ? editingProduct.visible : true,
        options: editingProduct.options || [],
        variantes: editingProduct.variantes || [],
      });
    } else {
      setForm({
        brand: "ANZY COLLECTION",
        name: "",
        category: content.categories[0]?.id || "gaines",
        badge: "Nouveauté",
        description: "",
        price: 0,
        currency: "XOF",
        material: "",
        sizes: "",
        images: [],
        stock: 0,
        visible: true,
        options: [],
        variantes: [],
      });
    }
  }, [editingProduct, content.categories]);

  const [newOptionName, setNewOptionName] = useState("");
  const [newValueInputs, setNewValueInputs] = useState<Record<number, string>>({});
  const [uploadingMain, setUploadingMain] = useState(false);

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploadingMain(true);
    const r = new FileReader();
    r.onloadend = () => { setForm(prev => ({ ...prev, images: [r.result as string, ...prev.images.slice(1)] })); setUploadingMain(false); };
    r.readAsDataURL(f);
  };

  const handleVarianteImage = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onloadend = () => {
      updateVariante(id, "image", r.result as string);
    };
    r.readAsDataURL(f);
  };

  const addOption = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!newOptionName.trim() || form.options.length >= 3) return;
    setForm(prev => ({ ...prev, options: [...prev.options, { name: newOptionName.trim(), values: [] }] }));
    setNewOptionName("");
  };

  const removeOption = (idx: number) => { 
    setForm(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) })); 
  };

  const addValue = (optIdx: number, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const val = newValueInputs[optIdx]?.trim(); if (!val) return;
    const opts = [...form.options];
    if (!opts[optIdx].values.includes(val)) { 
      opts[optIdx].values.push(val); 
      setForm(prev => ({ ...prev, options: opts })); 
    }
    setNewValueInputs({ ...newValueInputs, [optIdx]: "" });
  };

  const removeValue = (optIdx: number, valIdx: number) => {
    const opts = [...form.options]; 
    opts[optIdx].values.splice(valIdx, 1); 
    setForm(prev => ({ ...prev, options: opts }));
  };

  const generateVariantes = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (form.options.length === 0 || form.options.some(o => o.values.length === 0)) return;
    const combos: VarianteCombi[] = [];
    
    const recurse = (idx: number, current: Record<string, string>) => {
      if (idx === form.options.length) { 
        const existingKey = Object.values(current).join("-");
        const found = form.variantes.find(v => Object.values(v.combo).join("-") === existingKey);

        combos.push({ 
          id: found?.id || "v" + Date.now() + Math.random().toString(36).substr(2, 4), 
          combo: { ...current }, 
          price: found?.price !== undefined ? found.price : form.price, 
          stock: found?.stock !== undefined ? found.stock : (form.stock || 10), 
          image: found?.image || form.images[0] || "", 
          active: found?.active !== undefined ? found.active : true 
        }); 
        return; 
      }
      form.options[idx].values.forEach(v => recurse(idx + 1, { ...current, [form.options[idx].name]: v }));
    };

    recurse(0, {}); 
    setForm(prev => ({ ...prev, variantes: combos }));
  };

  const updateVariante = (id: string, field: string, value: any) => { 
    setForm(prev => ({ 
      ...prev, 
      variantes: prev.variantes.map(v => v.id === id ? { ...v, [field]: value } : v) 
    })); 
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
      variantes: form.variantes,
    };

    const products = editingProduct 
      ? content.products.map(p => p.id === product.id ? product : p) 
      : [...content.products, product];

    saveContent({ ...content, products }); 
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl space-y-8">
      
      {/* EN-TÊTE DU FORMULAIRE */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase font-semibold block">Catalogue Admin</span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2C2224]">
            {editingProduct ? "Modifier la pièce" : "Nouvelle création"}
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">Visibilité</span>
          <button 
            type="button" 
            onClick={() => setForm(prev => ({ ...prev, visible: !prev.visible }))} 
            className={`w-11 h-6 rounded-full transition-colors relative ${form.visible ? "bg-green-500" : "bg-gray-300"}`}
          >
            <span className={`block w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${form.visible ? "left-5.5" : "left-0.5"}`} />
          </button>
        </div>
      </div>

      {/* BLOC 1 : INFORMATIONS ET IMAGE PRINCIPALE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* IMAGE PRINCIPALE */}
        <div className="lg:col-span-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-2">Visuel de couverture *</label>
          <input type="file" accept="image/*" ref={mainImageRef} onChange={handleMainImage} className="hidden" />
          
          <div 
            onClick={() => mainImageRef.current?.click()} 
            className="group relative w-full h-56 rounded-2xl border border-dashed border-gray-300 bg-[#FAF7F5] flex flex-col items-center justify-center cursor-pointer hover:border-[#E88D9E] hover:bg-[#FAF7F5]/80 transition-all duration-300 overflow-hidden"
          >
            {uploadingMain ? (
              <div className="w-8 h-8 border-2 border-[#E88D9E] border-t-transparent rounded-full animate-spin" />
            ) : form.images[0] ? (
              <>
                <img src={form.images[0]} alt="Aperçu" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-mono uppercase tracking-wider">
                  Changer l'image
                </div>
              </>
            ) : (
              <div className="text-center p-4 space-y-2">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto text-gray-400 group-hover:text-[#E88D9E] group-hover:border-[#E88D9E] transition-colors">
                  📷
                </div>
                <p className="text-xs font-medium text-gray-600">Cliquez pour importer</p>
                <p className="text-[10px] text-gray-400 font-mono">PNG, JPG ou WEBP</p>
              </div>
            )}
          </div>
        </div>

        {/* CHAMPS PRINCIPAUX */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">Nom du produit *</label>
            <input 
              type="text" 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#E88D9E] focus:outline-none transition-colors" 
              placeholder="Ex: Prothèse en silicone 3-en-1" 
              required 
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">Marque</label>
            <input 
              type="text" 
              value={form.brand} 
              onChange={e => setForm({ ...form, brand: e.target.value })} 
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#E88D9E] focus:outline-none transition-colors" 
              placeholder="Ex: ANZY COLLECTION" 
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">Catégorie</label>
            <select 
              value={form.category} 
              onChange={e => setForm({ ...form, category: e.target.value })} 
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:border-[#E88D9E] focus:outline-none transition-colors"
            >
              {content.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">Prix de référence (F CFA)</label>
            <input 
              type="number" 
              value={form.price === 0 ? "" : form.price} 
              onChange={e => setForm({ ...form, price: e.target.value === "" ? 0 : Number(e.target.value) })} 
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#2C2224] focus:border-[#E88D9E] focus:outline-none transition-colors" 
              placeholder="Ex: 120000" 
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">Stock de sécurité</label>
            <input 
              type="number" 
              value={form.stock === 0 ? "" : form.stock} 
              onChange={e => setForm({ ...form, stock: e.target.value === "" ? 0 : Number(e.target.value) })} 
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#E88D9E] focus:outline-none transition-colors" 
              placeholder="Ex: 25" 
            />
          </div>
        </div>

      </div>

      {/* BLOC 2 : DÉTAILS SECONDAIRES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">Badge d'accroche</label>
          <select value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:border-[#E88D9E] focus:outline-none">
            <option>Nouveauté</option>
            <option>Bestseller</option>
            <option>Tendance</option>
            <option>Incontournable</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">Matière / Composition</label>
          <input type="text" value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#E88D9E] focus:outline-none" placeholder="Ex: Silicone médical haut de gamme" />
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">Tailles indicatives</label>
          <input type="text" value={form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#E88D9E] focus:outline-none" placeholder="Ex: S, M, L, XL" />
        </div>

        <div className="sm:col-span-3">
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">Description éditoriale</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-medium h-20 focus:border-[#E88D9E] focus:outline-none resize-none" placeholder="Décrivez les atouts de ce produit..." />
        </div>
      </div>

      {/* OPTIONS DU PRODUIT */}
      <div className="bg-[#FAF7F5]/80 rounded-2xl p-5 border border-gray-200/50 space-y-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#2C2224] font-bold">1. Options du produit (max 3)</h3>
          <p className="text-[11px] text-gray-400 font-light">Ajoutez des options comme Couleur, Poids, Contenance...</p>
        </div>

        {form.options.map((opt, i) => (
          <div key={i} className="bg-white rounded-xl p-3.5 border border-gray-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2C2224] uppercase tracking-wider">{opt.name}</span>
              <button type="button" onClick={() => removeOption(i)} className="text-red-400 hover:text-red-600 text-xs font-mono">Supprimer</button>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {opt.values.map((v, j) => (
                <span key={j} className="bg-[#FAF7F5] px-3 py-1 rounded-lg text-xs font-medium border border-gray-200 flex items-center gap-2">
                  {v}
                  <button type="button" onClick={() => removeValue(i, j)} className="text-gray-400 hover:text-red-500">✕</button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input 
                type="text" 
                value={newValueInputs[i] || ""} 
                onChange={e => setNewValueInputs({ ...newValueInputs, [i]: e.target.value })} 
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addValue(i); } }} 
                placeholder="Nouvelle valeur (ex: Beige, Chair Clair)" 
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" 
              />
              <button type="button" onClick={e => addValue(i, e)} className="px-3 py-1.5 bg-[#E88D9E] text-white rounded-lg text-xs font-bold hover:bg-[#d67b8c] transition">+</button>
            </div>
          </div>
        ))}

        {form.options.length < 3 && (
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newOptionName} 
              onChange={e => setNewOptionName(e.target.value)} 
              placeholder="Nom de l'option (Ex: Couleur, Poids...)" 
              className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#E88D9E] focus:outline-none" 
            />
            <button type="button" onClick={e => addOption(e)} className="px-4 py-2 bg-[#2C2224] text-white rounded-xl text-xs font-mono uppercase tracking-wider font-semibold hover:bg-black transition">+ Ajouter une option</button>
          </div>
        )}

        {form.options.length > 0 && (
          <button type="button" onClick={e => generateVariantes(e)} className="w-full py-3 bg-[#E88D9E] text-white rounded-xl text-xs font-mono uppercase tracking-wider font-bold shadow-md hover:bg-[#d67b8c] transition">
            🔄 {form.variantes.length > 0 ? "Ré-générer les déclinaisons" : "Générer les combinaisons de variantes"}
          </button>
        )}
      </div>

      {/* BLOC DES VARIANTES GÉNÉRÉES */}
      <div className="bg-[#FAF7F5] rounded-3xl p-5 border border-gray-200/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/60 pb-3">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#2C2224] font-bold">
              2. Déclinaisons & Variantes ({form.variantes.length})
            </h3>
            <p className="text-[11px] text-gray-500 font-light">
              Ajustez l'image, le prix et le stock spécifique de chaque déclinaison.
            </p>
          </div>

          {form.variantes.length > 0 && (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-xs shrink-0">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Tout régler :</span>
              <button
                type="button"
                onClick={() => {
                  const p = prompt("Prix par défaut pour toutes les variantes (F CFA) :", form.price.toString());
                  if (p !== null && !isNaN(Number(p))) {
                    setForm(prev => ({
                      ...prev,
                      variantes: prev.variantes.map(v => ({ ...v, price: Number(p) }))
                    }));
                  }
                }}
                className="text-[#E88D9E] font-semibold hover:underline text-[11px]"
              >
                Prix
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => {
                  const s = prompt("Stock par défaut pour toutes les variantes :", form.stock.toString());
                  if (s !== null && !isNaN(Number(s))) {
                    setForm(prev => ({
                      ...prev,
                      variantes: prev.variantes.map(v => ({ ...v, stock: Number(s) }))
                    }));
                  }
                }}
                className="text-[#E88D9E] font-semibold hover:underline text-[11px]"
              >
                Stock
              </button>
            </div>
          )}
        </div>

        {/* LISTE OU MESSAGE D'AIDE */}
        {form.variantes.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-dashed border-gray-300 text-center space-y-2">
            <span className="text-2xl block">⚙️</span>
            <p className="text-xs font-medium text-gray-600">Aucune variante générée pour l'instant</p>
            <p className="text-[11px] text-gray-400 font-light">
              Ajoutez vos options ci-dessus (ex: Couleur, Poids) puis cliquez sur le bouton rose <strong className="text-[#E88D9E]">🔄 Générer les combinaisons</strong>.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {form.variantes.map((v) => {
              const imgAffichee = v.image || form.images[0];
              return (
                <div
                  key={v.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border transition-all ${
                    v.active ? "border-gray-200 shadow-sm" : "border-gray-100 bg-gray-50/50 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Toggle Actif / Inactif */}
                    <button
                      type="button"
                      onClick={() => updateVariante(v.id, "active", !v.active)}
                      className={`w-8 h-5 rounded-full transition-colors relative shrink-0 ${
                        v.active ? "bg-[#2C2224]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-0.5 ${
                          v.active ? "left-3.5" : "left-0.5"
                        }`}
                      />
                    </button>

                    {/* MINIATURE IMAGE VARIANTE */}
                    <div className="relative shrink-0">
                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => { varianteImageRefs.current[v.id] = el; }}
                        onChange={(e) => handleVarianteImage(v.id, e)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => varianteImageRefs.current[v.id]?.click()}
                        className="w-10 h-10 rounded-xl bg-[#FAF7F5] border border-gray-200 flex items-center justify-center overflow-hidden hover:border-[#E88D9E] transition group"
                        title="Changer l'image de cette variante"
                      >
                        {imgAffichee ? (
                          <img src={imgAffichee} alt="Variante" className="w-full h-full object-contain p-0.5" />
                        ) : (
                          <span className="text-xs text-gray-400">📷</span>
                        )}
                      </button>
                    </div>

                    {/* BADGES D'OPTIONS */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {Object.entries(v.combo).map(([key, val]) => (
                        <span
                          key={key}
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#FAF7F5] text-[#2C2224] border border-gray-200/60"
                        >
                          <span className="text-gray-400 font-normal mr-1">{key}:</span> {val}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* PRIX ET STOCK */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={v.price === 0 ? "" : v.price}
                        onChange={(e) =>
                          updateVariante(v.id, "price", e.target.value === "" ? 0 : Number(e.target.value))
                        }
                        placeholder="Prix"
                        className="w-24 px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-right focus:border-[#E88D9E] focus:outline-none"
                      />
                      <span className="text-[10px] font-mono text-gray-400">F CFA</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={v.stock === 0 ? "" : v.stock}
                        onChange={(e) =>
                          updateVariante(v.id, "stock", e.target.value === "" ? 0 : Number(e.target.value))
                        }
                        placeholder="Stock"
                        className="w-16 px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs text-center focus:border-[#E88D9E] focus:outline-none"
                      />
                      <span className="text-[10px] font-mono text-gray-400">U.</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BOUTON FINAL DE SAUVEGARDE */}
      <button 
        type="submit" 
        className="w-full bg-[#E88D9E] text-white py-4 rounded-2xl text-xs font-mono uppercase tracking-widest font-bold shadow-lg hover:bg-[#d67b8c] transition-all transform hover:-translate-y-0.5"
      >
        {editingProduct ? "💾 Enregistrer les modifications" : "✨ Créer et publier la pièce"}
      </button>

    </form>
  );
}