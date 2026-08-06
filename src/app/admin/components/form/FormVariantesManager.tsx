"use client";

import { useState, useRef } from "react";
import { VarianteCombi } from "@/context/StoreContext";

interface FormVariantesManagerProps {
  variantes: VarianteCombi[];
  options: any[];
  mainImage: string;
  updateVariante: (id: string, field: string, value: any) => void;
  deleteVariante: (id: string) => void;
  handleVarianteImage: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormVariantesManager({
  variantes,
  options,
  mainImage,
  updateVariante,
  deleteVariante,
  handleVarianteImage,
}: FormVariantesManagerProps) {
  const varianteImageRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [filterOptionKey, setFilterOptionKey] = useState<string>("ALL");
  const [filterOptionVal, setFilterOptionVal] = useState<string>("ALL");
  const [bulkTargetPrice, setBulkTargetPrice] = useState<string>("");
  const [bulkTargetStock, setBulkTargetStock] = useState<string>("");

  const isVarianteMatchingFilter = (v: VarianteCombi) => {
    if (filterOptionKey === "ALL" || filterOptionVal === "ALL") return true;
    return v.combo[filterOptionKey] === filterOptionVal;
  };

  const applyTargetedBulkPrice = () => {
    const priceNum = Number(bulkTargetPrice);
    if (isNaN(priceNum) || priceNum < 0) return;
    variantes.forEach((v) => {
      if (isVarianteMatchingFilter(v)) updateVariante(v.id, "price", priceNum);
    });
    setBulkTargetPrice("");
  };

  const applyTargetedBulkStock = () => {
    const stockNum = Number(bulkTargetStock);
    if (isNaN(stockNum) || stockNum < 0) return;
    variantes.forEach((v) => {
      if (isVarianteMatchingFilter(v)) updateVariante(v.id, "stock", stockNum);
    });
    setBulkTargetStock("");
  };

  const toggleTargetedVariantes = (active: boolean) => {
    variantes.forEach((v) => {
      if (isVarianteMatchingFilter(v)) updateVariante(v.id, "active", active);
    });
  };

  const selectedOptionValues =
    filterOptionKey !== "ALL"
      ? options.find((o) => o.name === filterOptionKey)?.values || []
      : [];

  return (
    <div className="bg-[#FAF7F5] rounded-3xl p-3.5 sm:p-5 border border-gray-200 space-y-4">
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#2C2224] font-bold">
          2. Déclinaisons & Modificateurs ({variantes.length})
        </h3>
        <p className="text-[10px] text-gray-500 font-light">
          Appliquez des règles par lot (ex: Tous les 5kg).
        </p>
      </div>

      {variantes.length > 0 && (
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
                {options.map((opt: any) => (
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
                {selectedOptionValues.map((val: string) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          </div>

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

      {variantes.length === 0 ? (
        <div className="bg-white rounded-2xl p-5 border border-dashed border-gray-300 text-center space-y-1">
          <span className="text-xl block">⚙️</span>
          <p className="text-xs font-medium text-gray-600">Aucune déclinaison générée</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-0.5">
          {variantes.map((v) => {
            const isMatched = isVarianteMatchingFilter(v);
            const imgAffichee = v.image || mainImage;
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
  );
}