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
  const { content } = useStore();

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        brand: editingProduct.brand || "ANZY COLLECTION",
        name: editingProduct.name || "",
        category: editingProduct.category || editingProduct.categoryId || "gaines",
        badge: editingProduct.badge || "Nouveauté",
        description: editingProduct.description || "",
        price: Number(editingProduct.price) || 0,
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

  const handleMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setUploadingMain(true);

    const newImagesUrls = await Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );

    setForm((prev) => ({ 
      ...prev, 
      images: [...prev.images, ...newImagesUrls] 
    }));
    
    setUploadingMain(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
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

  const addOption = (name: string) => { setForm((prev) => ({ ...prev, options: [...prev.options, { name, values: [] }] })); };
  const removeOption = (idx: number) => { setForm((prev) => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) })); };
  const addValue = (optIdx: number, val: string) => {
    const opts = [...form.options];
    if (!opts[optIdx].values.includes(val)) { opts[optIdx].values.push(val); setForm((prev) => ({ ...prev, options: opts })); }
  };
  const removeValue = (optIdx: number, valIdx: number) => {
    const opts = [...form.options]; opts[optIdx].values.splice(valIdx, 1); setForm((prev) => ({ ...prev, options: opts }));
  };

  // Assigne une couleur exacte (hex) à une valeur d'option — ex: "Rouge" -> "#c0392b".
  // Stockée sur le produit lui-même, réutilisée par le tiroir produit pour afficher
  // le vrai swatch au lieu de deviner une couleur approximative à partir du nom.
  const setValueColor = (optIdx: number, val: string, hex: string) => {
    const opts = [...form.options];
    opts[optIdx] = { ...opts[optIdx], colorMap: { ...(opts[optIdx].colorMap || {}), [val]: hex } };
    setForm((prev) => ({ ...prev, options: opts }));
  };

  const setOptionDefaultValue = (optName: string, val: string, field: "price" | "stock", amount: number) => {
    setOptionDefaults((prev) => ({ ...prev, [`${optName}-${val}-${field}`]: amount }));
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
      form.options[idx].values.forEach((v) => recurse(idx + 1, { ...current, [form.options[idx].name]: v }));
    };

    recurse(0, {});
    setForm((prev) => ({ ...prev, variantes: combos }));
  };

  const updateVariante = (id: string, field: string, value: any) => {
    setForm((prev) => ({ ...prev, variantes: prev.variantes.map((v) => (v.id === id ? { ...v, [field]: value } : v)) }));
  };

  const deleteVariante = (id: string) => {
    setForm((prev) => ({ ...prev, variantes: prev.variantes.filter((v) => v.id !== id) }));
  };

  // Upload automatique vers Vercel Blob si c'est un Base64
  const uploadIfBase64 = async (imgUrl: string) => {
    if (!imgUrl || !imgUrl.startsWith("data:image")) return imgUrl; 
    
    const response = await fetch(imgUrl);
    const blob = await response.blob();
    const ext = blob.type === "image/gif" ? "gif" : "png";
    const filename = `produit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

    const uploadRes = await fetch(`/api/upload?filename=${filename}`, {
      method: "POST",
      body: blob,
    });

    if (!uploadRes.ok) throw new Error("Échec de l'upload de l'image");
    
    const data = await uploadRes.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalImages = await Promise.all(form.images.map(uploadIfBase64));

      const finalVariantes = await Promise.all(
        form.variantes.map(async (v) => ({
          ...v,
          image: await uploadIfBase64(v.image),
        }))
      );

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
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: [],
        images: finalImages,      
        stock: Number(form.stock),
        visible: form.visible,
        options: form.options,
        variantes: finalVariantes,
      };

      await onSave(product);

    } catch (error) {
      console.error("Erreur d'upload :", error);
      alert("Erreur lors de l'envoi des photos. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-4 sm:p-8 border border-gray-100 shadow-xl space-y-6 text-[#2C2224] max-w-full overflow-hidden relative"
    >
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-3xl">
          <div className="w-10 h-10 border-4 border-[#E88D9E] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C2224]">Upload des images...</p>
        </div>
      )}

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

      <FormMainInfo
        form={form}
        setForm={setForm}
        categories={content?.categories || []}
        uploadingMain={uploadingMain}
        handleMainImage={handleMainImage}
        handleRemoveImage={handleRemoveImage}
      />

      <FormOptionsBuilder
        options={form.options}
        optionDefaults={optionDefaults}
        addOption={addOption}
        removeOption={removeOption}
        addValue={addValue}
        removeValue={removeValue}
        setOptionDefaultValue={setOptionDefaultValue}
        setValueColor={setValueColor}
        generateVariantes={generateVariantes}
      />

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
        disabled={isSubmitting}
        className="w-full bg-[#2C2224] hover:bg-[#E88D9E] disabled:bg-gray-400 text-white py-3.5 rounded-2xl text-xs font-mono uppercase tracking-[0.2em] font-bold shadow-xl transition-all duration-300 cursor-pointer active:scale-98"
      >
        {isSubmitting ? "TRAITEMENT EN COURS..." : editingProduct ? "💾 ENREGISTRER LES MODIFICATIONS" : "✨ PUBLIER LA NOUVELLE CRÉATION"}
      </button>
    </form>
  );
}