"use client";

import { useState, useRef, useEffect } from "react";
import { Product, VarianteOption, VarianteCombi, useStore } from "@/context/StoreContext";

interface Props {
  editingProduct: Product | null;
  onSave: (product?: any) => void;
}

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

  const [optionDefaults, setOptionDefaults] = useState<Record<string, number>>({});

  const [filterOptionKey, setFilterOptionKey] = useState<string>("ALL");
  const [filterOptionVal, setFilterOptionVal] = useState<string>("ALL");
  const [bulkTargetPrice, setBulkTargetPrice] = useState<string>("");
  const [bulkTargetStock, setBulkTargetStock] = useState<string>("");

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
        category: content?.categories?.[0]?.id || "gaines",
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
  }, [editingProduct, content?.categories]);

  useEffect(() => {
    if (form.variantes.length > 0) {
      const totalStock = form.variantes
        .filter((v) => v.active)
        .reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
      setForm((prev) => ({ ...prev, stock: totalStock }));
    }
  }, [form.variantes]);

  const [newOptionName, setNewOptionName] = useState("");
  const [newValueInputs, setNewValueInputs] = useState<Record<number, string>>({});
  const [uploadingMain, setUploadingMain] = useState(false);

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadingMain(true);
    const r = new FileReader();
    r.onloadend = () => {
      setForm((prev) => ({ ...prev, images: [r.result as string, ...prev.images.slice(1)] }));
      setUploadingMain(false);
    };
    r.readAsDataURL(f);
  };

  const handleVarianteImage = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onloadend = () => {
      updateVariante(id, "image", r.result as string);
    };
    r.readAsDataURL(f);
  };

  const addOption = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!newOptionName.trim() || form.options.length >= 3) return;
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { name: newOptionName.trim(), values: [] }],
    }));
    setNewOptionName("");
  };

  const removeOption = (idx: number) => {
    setForm((prev) => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));
  };

  const addValue = (optIdx: number, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const val = newValueInputs[optIdx]?.trim();
    if (!val) return;
    const opts = [...form.options];
    if (!opts[optIdx].values.includes(val)) {
      opts[optIdx].values.push(val);
      setForm((prev) => ({ ...prev, options: opts }));
    }
    setNewValueInputs({ ...newValueInputs, [optIdx]: "" });
  };

  const removeValue = (optIdx: number, valIdx: number) => {
    const opts = [...form.options];
    opts[optIdx].values.splice(valIdx, 1);
    setForm((prev) => ({ ...prev, options: opts }));
  };

  const setOptionDefaultValue = (optName: string, val: string, field: "price" | "stock", amount: number) => {
    setOptionDefaults((prev) => ({
      ...prev,
      [`${optName}-${val}-${field}`]: amount,
    }));
  };

  const generateVariantes = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (form.options.length === 0 || form.options.some((o) => o.values.length === 0)) return;
    const combos: VarianteCombi[] = [];

    const recurse = (idx: number, current: Record<string, string>) => {
      if (idx === form.options.length) {
        const existingKey = Object.values(current).join("-");
        const found = form.variantes.find((v) => Object.values(v.combo).join("-") === existingKey);

        let calculatedPrice = form.price;
        let calculatedStock = 5;

        Object.entries(current).forEach(([optKey, optVal]) => {
          const customPrice = optionDefaults[`${optKey}-${optVal}-price`];
          const customStock = optionDefaults[`${optKey}-${optVal}-stock`];
          if (customPrice !== undefined && customPrice > 0) calculatedPrice = customPrice;
          if (customStock !== undefined && customStock >= 0) calculatedStock = customStock;
        });

        combos.push({
          id: found?.id || "v" + Date.now() + Math.random().toString(36).substr(2, 4),
          combo: { ...current },
          price: found?.price !== undefined ? found.price : calculatedPrice,
          stock: found?.stock !== undefined ? found.stock : calculatedStock,
          image: found?.image || form.images[0] || "",
          active: found?.active !== undefined ? found.active : true,
        });
        return;
      }
      form.options[idx].values.forEach((v) =>
        recurse(idx + 1, { ...current, [form.options[idx].name]: v })
      );
    };

    recurse(0, {});
    setForm((prev) => ({ ...prev, variantes: combos }));
  };

  const updateVariante = (id: string, field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      variantes: prev.variantes.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    }));
  };

  const deleteVariante = (id: string) => {
    setForm((prev) => ({
      ...prev,
      variantes: prev.variantes.filter((v) => v.id !== id),
    }));
  };

  const isVarianteMatchingFilter = (v: VarianteCombi) => {
    if (filterOptionKey === "ALL" || filterOptionVal === "ALL") return true;
    return v.combo[filterOptionKey] === filterOptionVal;
  };

  const applyTargetedBulkPrice = () => {
    const priceNum = Number(bulkTargetPrice);
    if (isNaN(priceNum) || priceNum < 0) return;

    setForm((prev) => ({
      ...prev,
      variantes: prev.variantes.map((v) =>
        isVarianteMatchingFilter(v) ? { ...v, price: priceNum } : v
      ),
    }));
    setBulkTargetPrice("");
  };

  const applyTargetedBulkStock = () => {
    const stockNum = Number(bulkTargetStock);
    if (isNaN(stockNum) || stockNum < 0) return;

    setForm((prev) => ({
      ...prev,
      variantes: prev.variantes.map((v) =>
        isVarianteMatchingFilter(v) ? { ...v, stock: stockNum } : v
      ),
    }));
    setBulkTargetStock("");
  };

  const toggleTargetedVariantes = (active: boolean) => {
    setForm((prev) => ({
      ...prev,
      variantes: prev.variantes.map((v) =>
        isVarianteMatchingFilter(v) ? { ...v, active } : v
      ),
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
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: [],
      images: form.images,
      stock: Number(form.stock),
      visible: form.visible,
      options: form.options,
      variantes: form.variantes,
    };

    const currentProducts = content?.produits || content?.products || [];
    const updatedProducts = editingProduct
      ? currentProducts.map((p: any) => (p.id === product.id ? product : p))
      : [...currentProducts, product];

    saveContent({
      ...content,
      produits: updatedProducts,
      products: updatedProducts,
    });
    onSave(product);
  };

  const selectedOptionValues =
    filterOptionKey !== "ALL"
      ? form.options.find((o) => o.name === filterOptionKey)?.values || []
      : [];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-4 sm:p-8 border border-gray-100 shadow-xl space-y-6 text-[#2C2224] max-w-full overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <span className="text-[9px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold block">
            Catalogue Admin
          </span>
          <h2 className="text-lg sm:text-2xl font-serif font-bold">
            {editingProduct ? "Modifier la pièce" : "Nouvelle création"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-400">Visibilité</span>
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, visible: !prev.visible }))}
            className={`w-10 h-5 sm:w-11 sm:h-6 rounded-full transition-colors relative cursor-pointer ${
              form.visible ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`block w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition-transform absolute top-0.5 ${
                form.visible ? "left-5.5 sm:left-5.5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* INFORMATIONS PRINCIPALES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1.5">
            Visuel de couverture *
          </label>
          <input
            type="file"
            accept="image/*"
            ref={mainImageRef}
            onChange={handleMainImage}
            className="hidden"
          />

          <div
            onClick={() => mainImageRef.current?.click()}
            className="group relative w-full h-48 sm:h-56 rounded-2xl border border-dashed border-gray-300 bg-[#FAF7F5] flex flex-col items-center justify-center cursor-pointer hover:border-[#E88D9E] transition-all overflow-hidden"
          >
            {uploadingMain ? (
              <div className="w-7 h-7 border-2 border-[#E88D9E] border-t-transparent rounded-full animate-spin" />
            ) : form.images[0] ? (
              <>
                <img
                  src={form.images[0]}
                  alt="Aperçu"
                  className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-mono uppercase tracking-wider">
                  Changer l'image
                </div>
              </>
            ) : (
              <div className="text-center p-3 space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto text-gray-400">
                  📷
                </div>
                <p className="text-xs font-medium text-gray-600">Importer visuel</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">
              Nom du produit *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#E88D9E] focus:outline-none"
              placeholder="Ex: Prothèse en silicone 3-en-1"
              required
            />
          </div>

          <div>
            <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">
              Marque
            </label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#E88D9E] focus:outline-none"
              placeholder="Ex: ANZY COLLECTION"
            />
          </div>

          <div>
            <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">
              Catégorie
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:border-[#E88D9E] focus:outline-none"
            >
              {(content?.categories || []).map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">
              Prix de référence (F CFA)
            </label>
            <input
              type="number"
              value={form.price === 0 ? "" : form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value === "" ? 0 : Number(e.target.value) })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:border-[#E88D9E] focus:outline-none"
              placeholder="Ex: 120000"
            />
          </div>

          <div>
            <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">
              Stock global (Auto)
            </label>
            <input
              type="number"
              disabled
              value={form.stock}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* DÉTAILS SECONDAIRES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
        <div>
          <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">
            Badge
          </label>
          <select
            value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:border-[#E88D9E] focus:outline-none"
          >
            <option>Nouveauté</option>
            <option>Bestseller</option>
            <option>Tendance</option>
            <option>Incontournable</option>
          </select>
        </div>

        <div>
          <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">
            Matière
          </label>
          <input
            type="text"
            value={form.material}
            onChange={(e) => setForm({ ...form, material: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#E88D9E] focus:outline-none"
            placeholder="Silicone médical"
          />
        </div>

        <div>
          <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">
            Tailles indicatives
          </label>
          <input
            type="text"
            value={form.sizes}
            onChange={(e) => setForm({ ...form, sizes: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#E88D9E] focus:outline-none"
            placeholder="S, M, L, XL"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium h-16 focus:border-[#E88D9E] focus:outline-none resize-none"
            placeholder="Description du produit..."
          />
        </div>
      </div>

      {/* SECTION 1: CRÉATION DES OPTIONS ET PRIX PAR DÉFAUT (RESPONSIVE) */}
      <div className="bg-[#FAF7F5] rounded-2xl p-3.5 sm:p-5 border border-gray-200/60 space-y-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#2C2224] font-bold">
            1. Options & Pré-tarification
          </h3>
          <p className="text-[10px] text-gray-400 font-light">
            Créez vos critères et attribuez-leur un tarif par défaut.
          </p>
        </div>

        {form.options.map((opt, i) => (
          <div key={i} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-[11px] font-bold text-[#2C2224] uppercase tracking-wider">
                Option #{i + 1}: {opt.name}
              </span>
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="text-red-400 hover:text-red-600 text-[10px] font-mono uppercase font-bold cursor-pointer"
              >
                Supprimer
              </button>
            </div>

            {/* GRILLE DES VALEURS PARFAITEMENT ADAPTÉE AUX ÉCRANS ETROITS */}
            <div className="space-y-2">
              {opt.values.map((v, j) => {
                const priceKey = `${opt.name}-${v}-price`;
                const currentDefaultPrice = optionDefaults[priceKey] || "";

                return (
                  <div
                    key={j}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FAF7F5] p-2.5 rounded-xl border border-gray-200/60"
                  >
                    <div className="flex items-center justify-between w-full sm:w-auto">
                      <span className="text-xs font-bold text-[#2C2224] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E88D9E]" />
                        {v}
                      </span>
                      {/* Bouton de suppression sur mobile */}
                      <button
                        type="button"
                        onClick={() => removeValue(i, j)}
                        className="text-gray-400 hover:text-red-500 sm:hidden text-xs px-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 w-full sm:w-auto">
                      <input
                        type="number"
                        placeholder="Prix spécifique"
                        value={currentDefaultPrice}
                        onChange={(e) =>
                          setOptionDefaultValue(opt.name, v, "price", Number(e.target.value))
                        }
                        className="w-full sm:w-28 px-2.5 py-1 text-xs bg-white border border-gray-200 rounded-lg font-mono font-bold focus:outline-none focus:border-[#E88D9E]"
                      />
                      <span className="text-[9px] font-mono text-gray-400 shrink-0">F CFA</span>
                      
                      {/* Bouton suppression desktop */}
                      <button
                        type="button"
                        onClick={() => removeValue(i, j)}
                        className="text-gray-400 hover:text-red-500 hidden sm:block p-1 cursor-pointer ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newValueInputs[i] || ""}
                onChange={(e) => setNewValueInputs({ ...newValueInputs, [i]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addValue(i);
                  }
                }}
                placeholder="Ajouter une valeur (ex: 5kg, Peau noir...)"
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none min-w-0"
              />
              <button
                type="button"
                onClick={(e) => addValue(i, e)}
                className="px-3 py-1.5 bg-[#E88D9E] text-white rounded-lg text-xs font-bold hover:bg-[#d67b8c] transition cursor-pointer shrink-0"
              >
                +
              </button>
            </div>
          </div>
        ))}

        {form.options.length < 3 && (
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              placeholder="Nom du critère (Ex: Poids, Couleur...)"
              className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#E88D9E] focus:outline-none"
            />
            <button
              type="button"
              onClick={(e) => addOption(e)}
              className="px-4 py-2 bg-[#2C2224] text-white rounded-xl text-xs font-mono uppercase tracking-wider font-semibold hover:bg-black transition cursor-pointer shrink-0"
            >
              + Ajouter option
            </button>
          </div>
        )}

        {form.options.length > 0 && (
          <button
            type="button"
            onClick={(e) => generateVariantes(e)}
            className="w-full py-3 bg-[#E88D9E] text-white rounded-xl text-xs font-mono uppercase tracking-wider font-bold shadow-xs hover:bg-[#d67b8c] transition cursor-pointer active:scale-98"
          >
            🔄 Générer les déclinaisons
          </button>
        )}
      </div>

      {/* SECTION 2: BULK EDITING CIBLÉ AVEC LAYOUT COMPACT */}
      <div className="bg-[#FAF7F5] rounded-3xl p-3.5 sm:p-5 border border-gray-200 space-y-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#2C2224] font-bold">
            2. Déclinaisons & Modificateurs ({form.variantes.length})
          </h3>
          <p className="text-[10px] text-gray-500 font-light">
            Appliquez des règles par lot (ex: Tous les 5kg).
          </p>
        </div>

        {/* BARRE BULK FILTER COMPACTE */}
        {form.variantes.length > 0 && (
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 space-y-3 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2 gap-1">
              <span className="text-[9px] font-mono text-gray-400 uppercase font-bold">
                🎯 ACTION EN MASSE CIBLÉE
              </span>
              <span className="text-[9px] font-mono text-[#E88D9E] font-bold">
                {filterOptionKey !== "ALL" && filterOptionVal !== "ALL"
                  ? `Cible : [${filterOptionKey} = ${filterOptionVal}]`
                  : "Cible : Toutes les déclinaisons"}
              </span>
            </div>

            {/* CRITÈRE & VALEUR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#FAF7F5] p-2.5 rounded-xl border border-gray-100">
              <div>
                <label className="text-[8px] font-mono text-gray-400 uppercase block mb-0.5">Sur quel critère ?</label>
                <select
                  value={filterOptionKey}
                  onChange={(e) => {
                    setFilterOptionKey(e.target.value);
                    setFilterOptionVal("ALL");
                  }}
                  className="w-full text-[11px] font-mono bg-white border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:border-[#E88D9E]"
                >
                  <option value="ALL">-- Tous les critères --</option>
                  {form.options.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      Option : {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[8px] font-mono text-gray-400 uppercase block mb-0.5">Quelle valeur ciblée ?</label>
                <select
                  disabled={filterOptionKey === "ALL"}
                  value={filterOptionVal}
                  onChange={(e) => setFilterOptionVal(e.target.value)}
                  className="w-full text-[11px] font-mono bg-white border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:border-[#E88D9E] disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="ALL">-- Toutes les valeurs --</option>
                  {selectedOptionValues.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CHAMPS DE MODIFICATION DE LA CIBLE EN APPLAT COMPACT */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  placeholder="Prix ciblé (ex: 150000)"
                  value={bulkTargetPrice}
                  onChange={(e) => setBulkTargetPrice(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#E88D9E]"
                />
                <button
                  type="button"
                  onClick={applyTargetedBulkPrice}
                  className="py-1.5 px-4 bg-[#2C2224] text-white text-[9px] font-mono uppercase font-bold rounded-xl hover:bg-black transition cursor-pointer shrink-0"
                >
                  Appliquer prix
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  placeholder="Stock ciblé (ex: 10)"
                  value={bulkTargetStock}
                  onChange={(e) => setBulkTargetStock(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#E88D9E]"
                />
                <button
                  type="button"
                  onClick={applyTargetedBulkStock}
                  className="py-1.5 px-4 bg-[#2C2224] text-white text-[9px] font-mono uppercase font-bold rounded-xl hover:bg-black transition cursor-pointer shrink-0"
                >
                  Appliquer stock
                </button>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => toggleTargetedVariantes(true)}
                  className="flex-1 py-1.5 text-[9px] font-mono uppercase font-bold bg-green-50 text-green-700 border border-green-200 rounded-xl hover:bg-green-100 transition cursor-pointer text-center"
                >
                  Activer cible
                </button>
                <button
                  type="button"
                  onClick={() => toggleTargetedVariantes(false)}
                  className="flex-1 py-1.5 text-[9px] font-mono uppercase font-bold bg-gray-100 text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-200 transition cursor-pointer text-center"
                >
                  Désactiver cible
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LISTE DES VARIANTES RESTRUCTURÉE */}
        {form.variantes.length === 0 ? (
          <div className="bg-white rounded-2xl p-5 border border-dashed border-gray-300 text-center space-y-1">
            <span className="text-xl block">⚙️</span>
            <p className="text-xs font-medium text-gray-600">Aucune déclinaison générée</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-0.5">
            {form.variantes.map((v) => {
              const isMatched = isVarianteMatchingFilter(v);
              const imgAffichee = v.image || form.images[0];
              return (
                <div
                  key={v.id}
                  className={`p-3 rounded-2xl border transition-all space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3 ${
                    !isMatched
                      ? "bg-gray-50/40 opacity-40 border-gray-100"
                      : v.active
                      ? "bg-white border-gray-200 shadow-2xs"
                      : "bg-white border-gray-100 opacity-60"
                  }`}
                >
                  {/* HAUT DE CARTE (MOBILE) ET GAUCHE (DESKTOP) */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => updateVariante(v.id, "active", !v.active)}
                      className={`w-7 h-4 sm:w-8 sm:h-5 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                        v.active ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`block w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full transition-transform absolute top-0.5 ${
                          v.active ? "left-3.5 sm:left-3.5" : "left-0.5"
                        }`}
                      />
                    </button>

                    <div className="relative shrink-0">
                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => {
                          varianteImageRefs.current[v.id] = el;
                        }}
                        onChange={(e) => handleVarianteImage(v.id, e)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => varianteImageRefs.current[v.id]?.click()}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FAF7F5] border border-gray-200 flex items-center justify-center overflow-hidden hover:border-[#E88D9E] transition cursor-pointer"
                      >
                        {imgAffichee ? (
                          <img
                            src={imgAffichee}
                            alt="Variante"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-gray-400">📷</span>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1 items-center min-w-0">
                      {Object.entries(v.combo).map(([key, val]) => (
                        <span
                          key={key}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#FAF7F5] text-[#2C2224] border border-gray-200/60"
                        >
                          <span className="text-gray-400 uppercase text-[8px] mr-1">{key}:</span>{" "}
                          <strong className="font-semibold">{val}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* BAS DE CARTE SAISIE PRIX & STOCK (MOBILE) ET DROITE (DESKTOP) */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 border-gray-100 pt-2 sm:pt-0 shrink-0">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={v.price === 0 ? "" : v.price}
                        onChange={(e) =>
                          updateVariante(
                            v.id,
                            "price",
                            e.target.value === "" ? 0 : Number(e.target.value)
                          )
                        }
                        placeholder="Prix"
                        className="w-20 sm:w-24 px-2 py-1 rounded-lg border border-gray-200 text-xs font-mono font-bold text-right focus:border-[#E88D9E] focus:outline-none"
                      />
                      <span className="text-[9px] font-mono text-gray-400">F CFA</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={v.stock === 0 ? "" : v.stock}
                        onChange={(e) =>
                          updateVariante(
                            v.id,
                            "stock",
                            e.target.value === "" ? 0 : Number(e.target.value)
                          )
                        }
                        placeholder="Stock"
                        className="w-12 sm:w-14 px-1.5 py-1 rounded-lg border border-gray-200 text-xs font-mono text-center focus:border-[#E88D9E] focus:outline-none"
                      />
                      <span className="text-[9px] font-mono text-gray-400">U.</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteVariante(v.id)}
                      className="w-6 h-6 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center text-xs cursor-pointer ml-1 shrink-0"
                      title="Supprimer cette déclinaison"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-[#2C2224] hover:bg-[#E88D9E] text-white py-3.5 rounded-2xl text-xs font-mono uppercase tracking-[0.2em] font-bold shadow-xl transition-all duration-300 cursor-pointer active:scale-98"
      >
        {editingProduct ? "💾 ENREGISTRER LES MODIFICATIONS" : "✨ PUBLIER LA NOUVELLE CRÉATION"}
      </button>
    </form>
  );
}