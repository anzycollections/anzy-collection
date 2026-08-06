"use client";

import { useRef } from "react";

interface FormMainInfoProps {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  categories: any[];
  uploadingMain: boolean;
  handleMainImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormMainInfo({
  form,
  setForm,
  categories,
  uploadingMain,
  handleMainImage,
}: FormMainInfoProps) {
  const mainImageRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
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
              {(categories || []).map((c: any) => (
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
    </div>
  );
}