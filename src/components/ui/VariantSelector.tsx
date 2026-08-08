"use client";

import { useMemo, useState, useEffect } from "react";

interface VariantSelectorProps {
  variantes: any[];
  selectedVariante: any;
  onSelectVariante: (v: any) => void;
  currency?: string;
}

export default function VariantSelector({
  variantes,
  selectedVariante,
  onSelectVariante,
  currency = "XOF",
}: VariantSelectorProps) {
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  const { weights, models, isComplex } = useMemo(() => {
    const w = new Set<string>();
    const m = new Set<string>();

    variantes.forEach((v) => {
      const label = v.name || v.title || "";
      if (label.includes(" - ") || label.includes(" / ") || label.includes(" – ")) {
        const sep = label.includes(" / ") ? " / " : (label.includes(" - ") ? " - " : " – ");
        const [p, mo] = label.split(sep);
        w.add(p.trim());
        m.add(mo.trim());
      } else if (v.combo) {
        Object.values(v.combo).forEach((val: any) => {
          const str = String(val);
          if (str.toLowerCase().includes("kg") || !isNaN(Number(str))) w.add(str);
          else m.add(str);
        });
      } else {
        m.add(label);
      }
    });

    return {
      weights: Array.from(w),
      models: Array.from(m),
      isComplex: w.size > 0 && m.size > 0,
    };
  }, [variantes]);

  useEffect(() => {
    if (selectedVariante) {
      const label = selectedVariante.name || selectedVariante.title || "";
      if (isComplex) {
        if (label.includes(" - ") || label.includes(" / ") || label.includes(" – ")) {
          const sep = label.includes(" / ") ? " / " : (label.includes(" - ") ? " - " : " – ");
          const [p, m] = label.split(sep);
          setSelectedWeight(p.trim());
          setSelectedModel(m.trim());
        } else if (selectedVariante.combo) {
          const vals = Object.values(selectedVariante.combo);
          vals.forEach((v: any) => {
            const str = String(v);
            if (str.toLowerCase().includes("kg") || !isNaN(Number(str))) setSelectedWeight(str);
            else setSelectedModel(str);
          });
        }
      } else {
        setSelectedModel(label);
      }
    }
  }, [selectedVariante, isComplex]);

  // CORRECTION MAJEURE ICI : Recherche dans les combos
  useEffect(() => {
    if (!isComplex) return;

    const found = variantes.find((v) => {
      const label = v.name || v.title || "";
      // 1. Vérifier si ça match avec le nom
      if (label && label.includes(selectedWeight) && label.includes(selectedModel)) return true;
      
      // 2. Vérifier si ça match avec les objets "combo" de ton admin
      if (v.combo) {
        const comboValues = Object.values(v.combo).map(val => String(val));
        if (comboValues.includes(selectedWeight) && comboValues.includes(selectedModel)) {
          return true;
        }
      }
      return false;
    });

    if (found && found.id !== selectedVariante?.id) {
      onSelectVariante(found);
    }
  }, [selectedWeight, selectedModel, variantes, isComplex, selectedVariante, onSelectVariante]);

  if (!isComplex) {
    return (
      <div className="space-y-3">
        <span className="text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase font-medium">
          Choix de la variante
        </span>
        <div className="flex flex-wrap gap-2">
          {variantes.map((v: any) => {
            const label = v.name || v.title || "Option";
            const isSelected = selectedVariante?.id === v.id;
            const disabled = (v.stock ?? 0) === 0;

            return (
              <button
                key={v.id || label}
                type="button"
                onClick={() => onSelectVariante(v)}
                disabled={disabled}
                className={`relative px-5 py-3 rounded-2xl text-[11px] font-mono transition-all duration-200 border
                  ${isSelected
                    ? "bg-[#2C2224] text-white border-[#2C2224] shadow-md scale-105"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm"
                  }
                  ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {label}
                {!disabled && v.stock <= 3 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {v.stock}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {weights.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase font-medium">
            Poids
          </span>
          <div className="flex flex-wrap gap-2">
            {weights.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setSelectedWeight(w)}
                className={`px-5 py-2.5 rounded-2xl text-[11px] font-mono transition-all duration-200 border cursor-pointer
                  ${w === selectedWeight
                    ? "bg-[#2C2224] text-white border-[#2C2224] shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                  }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      )}

      {models.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase font-medium">
            Modèle
          </span>
          <div className="flex flex-wrap gap-2">
            {models.map((m) => {
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedModel(m)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-[11px] font-mono transition-all duration-200 border cursor-pointer
                    ${m === selectedModel
                      ? "bg-white text-[#2C2224] border-[#2C2224] shadow-md font-bold"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                >
                  <span>{m}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}