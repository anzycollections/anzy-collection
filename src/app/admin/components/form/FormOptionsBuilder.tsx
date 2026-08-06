"use client";

import { useState } from "react";

interface FormOptionsBuilderProps {
  options: any[];
  optionDefaults: Record<string, number>;
  addOption: (name: string) => void;
  removeOption: (idx: number) => void;
  addValue: (optIdx: number, val: string) => void;
  removeValue: (optIdx: number, valIdx: number) => void;
  setOptionDefaultValue: (optName: string, val: string, field: "price" | "stock", amount: number) => void;
  generateVariantes: (e?: React.MouseEvent) => void;
}

export default function FormOptionsBuilder({
  options,
  optionDefaults,
  addOption,
  removeOption,
  addValue,
  removeValue,
  setOptionDefaultValue,
  generateVariantes,
}: FormOptionsBuilderProps) {
  const [newOptionName, setNewOptionName] = useState("");
  const [newValueInputs, setNewValueInputs] = useState<Record<number, string>>({});

  const handleAddOptionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newOptionName.trim()) return;
    addOption(newOptionName.trim());
    setNewOptionName("");
  };

  const handleAddValueClick = (optIdx: number, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const val = newValueInputs[optIdx]?.trim();
    if (!val) return;
    addValue(optIdx, val);
    setNewValueInputs({ ...newValueInputs, [optIdx]: "" });
  };

  return (
    <div className="bg-[#FAF7F5] rounded-2xl p-3.5 sm:p-5 border border-gray-200/60 space-y-4">
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#2C2224] font-bold">
          1. Options & Pré-tarification
        </h3>
        <p className="text-[10px] text-gray-400 font-light">
          Créez vos critères et attribuez-leur un tarif par défaut.
        </p>
      </div>

      {options.map((opt, i) => (
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

          <div className="space-y-2">
            {opt.values.map((v: string, j: number) => {
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
                  handleAddValueClick(i, e);
                }
              }}
              placeholder="Ajouter une valeur (ex: 5kg, Peau noir...)"
              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none min-w-0"
            />
            <button
              type="button"
              onClick={(e) => handleAddValueClick(i, e)}
              className="px-3 py-1.5 bg-[#E88D9E] text-white rounded-lg text-xs font-bold hover:bg-[#d67b8c] transition cursor-pointer shrink-0"
            >
              +
            </button>
          </div>
        </div>
      ))}

      {options.length < 3 && (
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
            onClick={handleAddOptionClick}
            className="px-4 py-2 bg-[#2C2224] text-white rounded-xl text-xs font-mono uppercase tracking-wider font-semibold hover:bg-black transition cursor-pointer shrink-0"
          >
            + Ajouter option
          </button>
        </div>
      )}

      {options.length > 0 && (
        <button
          type="button"
          onClick={generateVariantes}
          className="w-full py-3 bg-[#E88D9E] text-white rounded-xl text-xs font-mono uppercase tracking-wider font-bold shadow-xs hover:bg-[#d67b8c] transition cursor-pointer active:scale-98"
        >
          🔄 Générer les déclinaisons
        </button>
      )}
    </div>
  );
}