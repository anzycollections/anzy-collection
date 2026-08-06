"use client";

import { useState, useEffect } from "react";
import { Product, VarianteOption, VarianteCombi, useStore } from "@/context/StoreContext";
import FormMainInfo from "./form/FormMainInfo";
import FormOptionsBuilder from "./form/FormOptionsBuilder";
import FormVariantesManager from "./form/FormVariantesManager";

interface Props {
  editingProduct: Product | null;
  onSave: (product?: any) => void;
}

export default function ProductForm({ editingProduct, onSave }: Props) {
  const { content, saveContent } = useStore();

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
  const [uploadingMain, setUploadingMain] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        brand: editingProduct.brand || "ANZY COLLECTION",
        name: editingProduct.name || "",
        category: editingProduct.category || editingProduct.categoryId || "gaines",
        badge: editingProduct.badge || "Nouveauté",
        description: editingProduct.description || "",
        price: Number(editingProduct.price) || 0, // 👈 Transtypage en number pour TypeScript
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

  const addOption = (name: string) => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { name, values: [] }],
    }));
  };

  const removeOption = (idx: number) => {
    setForm((prev) => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));
  };

  const addValue = (optIdx: number, val: string) => {
    const opts = [...form.options];
    if (!opts[optIdx].values.includes(val)) {
      opts[optIdx].values.push(val);
      setForm((prev) => ({ ...prev, options: opts }));
    }
  };

  const removeValue = (optIdx: number, valIdx: number) => {
    const opts = [...form.options];
    opts[optIdx].values.splice(valIdx, 1);
    setForm((prev) => ({ ...prev, options: opts }));
  };

  const setOptionDefaultValue = (
    optName: string,
    val: string,
    field: "price" | "stock",
    amount: number
  ) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: editingProduct?.id || "p" + Date.now(),
      brand: form.brand,
      name: form.name,
      category: form.category,
      categoryId: form.category,
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

      {/* 1. INFORMATIONS GÉNÉRALES */}
      <FormMainInfo
        form={form}
        setForm={setForm}
        categories={content?.categories || []}
        uploadingMain={uploadingMain}
        handleMainImage={handleMainImage}
      />

      {/* 2. ÉTAPE 1 : CRÉATION ET TARIFICATION DES CRITÈRES */}
      <FormOptionsBuilder
        options={form.options}
        optionDefaults={optionDefaults}
        addOption={addOption}
        removeOption={removeOption}
        addValue={addValue}
        removeValue={removeValue}
        setOptionDefaultValue={setOptionDefaultValue}
        generateVariantes={generateVariantes}
      />

      {/* 3. ÉTAPE 2 : GESTION DES DÉCLINAISONS & BULK CIBLÉ */}
      <FormVariantesManager
        variantes={form.variantes}
        options={form.options}
        mainImage={form.images[0] || ""}
        updateVariante={updateVariante}
        deleteVariante={deleteVariante}
        handleVarianteImage={handleVarianteImage}
      />

      <button
        type="submit"
        className="w-full bg-[#2C2224] hover:bg-[#E88D9E] text-white py-3.5 rounded-2xl text-xs font-mono uppercase tracking-[0.2em] font-bold shadow-xl transition-all duration-300 cursor-pointer active:scale-98"
      >
        {editingProduct ? "💾 ENREGISTRER LES MODIFICATIONS" : "✨ PUBLIER LA NOUVELLE CRÉATION"}
      </button>
    </form>
  );
}