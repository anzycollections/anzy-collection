"use client";

import { useRef } from "react";

interface FormMainInfoProps {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  categories: any[];
  uploadingMain: boolean;
  handleMainImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
}

export default function FormMainInfo({
  form,
  setForm,
  categories,
  uploadingMain,
  handleMainImage,
  handleRemoveImage,
}: FormMainInfoProps) {
  const mainImageRef = useRef<HTMLInputElement>(null);
  const imagesList = form?.images || [];

  // === LOGIQUE DE DRAG & DROP ===
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("imageIndex", index.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Nécessaire pour autoriser le drop
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("imageIndex"), 10);
    
    if (isNaN(draggedIndex) || draggedIndex === targetIndex) return;

    const updatedImages = [...imagesList];
    const [draggedImage] = updatedImages.splice(draggedIndex, 1);
    updatedImages.splice(targetIndex, 0, draggedImage); // Insère l'image à sa nouvelle place

    setForm((prev: any) => ({ ...prev, images: updatedImages }));
  };
  // ==============================

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* COLONNE GAUCHE : GALERIE D'IMAGES & COUVERTURE */}
        <div className="lg:col-span-1">
          <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1.5">
            Galerie Photos (Glissez pour réorganiser) *
          </label>
          
          <input
            type="file"
            accept="image/*"
            multiple
            ref={mainImageRef}
            onChange={handleMainImage}
            className="hidden"
          />

          <div
            onClick={() => mainImageRef.current?.click()}
            className="w-full h-12 mb-3 rounded-xl border border-dashed border-gray-300 bg-[#FAF7F5] flex items-center justify-center cursor-pointer hover:border-[#E88D9E] transition-all active:scale-98"
          >
            {uploadingMain ? (
              <div className="w-5 h-5 border-2 border-[#E88D9E] border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="text-[10px] font-mono text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                ➕ Ajouter des photos
              </span>
            )}
          </div>

          {imagesList.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {imagesList.map((imgUrl: string, idx: number) => (
                <div 
                  key={`${imgUrl}-${idx}`} 
                  draggable // Rend l'élément déplaçable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, idx)}
                  className={`relative rounded-xl overflow-hidden border bg-white transition-all cursor-grab active:cursor-grabbing ${
                    idx === 0 
                      ? 'col-span-2 aspect-[4/3] border-[#2C2224] ring-2 ring-[#2C2224]/10 shadow-md' 
                      : 'aspect-square border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover pointer-events-none" // Empêche l'image de gêner le drag HTML5
                  />
                  
                  {/* BOUTON SUPPRIMER */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
                    className="absolute top-1.5 right-1.5 w-7 h-7 bg-white/90 text-red-500 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer z-10 font-bold text-xs"
                    title="Supprimer cette photo"
                  >
                    ✕
                  </button>

                  {/* INDICATEUR DE COUVERTURE */}
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 bg-[#2C2224] text-white text-[9px] font-mono px-2.5 py-1 rounded-md uppercase tracking-wider font-bold shadow-md flex items-center gap-1 pointer-events-none">
                      ★ Couverture
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            !uploadingMain && (
              <div 
                onClick={() => mainImageRef.current?.click()}
                className="w-full h-36 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center text-gray-400 p-4 text-center cursor-pointer hover:border-[#E88D9E] transition"
              >
                <div className="w-9 h-9 mb-1.5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm">📷</div>
                <p className="text-[9px] font-mono uppercase tracking-wider font-medium">Aucune photo sélectionnée</p>
              </div>
            )
          )}
        </div>

        {/* COLONNE DROITE : FORMULAIRE TEXTE */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-2">
            <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 font-semibold block mb-1">
              Nom du produit *
            </label>
            <input
              type="text"
              value={form?.name || ""}
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
              value={form?.brand || ""}
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
              value={form?.category || ""}
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
              value={form?.price === 0 ? "" : form?.price || ""}
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
              value={form?.stock || 0}
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
            value={form?.badge || ""}
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
            value={form?.material || ""}
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
            value={form?.sizes || ""}
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
            value={form?.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium h-16 focus:border-[#E88D9E] focus:outline-none resize-none"
            placeholder="Description du produit..."
          />
        </div>
      </div>
    </div>
  );
}