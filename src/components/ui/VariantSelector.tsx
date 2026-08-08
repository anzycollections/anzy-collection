"use client";

import { useMemo, useState, useEffect } from "react";

// Dictionnaire de reconnaissance des noms de couleur courants (FR + variantes usuelles).
// Si un libellé de variante correspond à une entrée ici, on affiche un rond coloré
// au lieu du texte. Sinon (ex: "S", "M", "42"), on garde l'affichage textuel actuel
// sans aucun changement — donc aucun risque pour les variantes non liées à la couleur.
const COLOR_MAP: Record<string, string> = {
  noir: "#1a1a1a", "noire": "#1a1a1a",
  blanc: "#ffffff", "blanche": "#ffffff",
  beige: "#e8dcc8",
  rose: "#e88d9e", "rose poudré": "#e8b4bc",
  rouge: "#c0392b", bordeaux: "#6d2130",
  bleu: "#2c4a7c", marine: "#1b2a4a", "bleu marine": "#1b2a4a", "bleu ciel": "#a9cce3",
  vert: "#3f6b4f", kaki: "#6b6b47", "vert olive": "#6b6b47", émeraude: "#046307",
  jaune: "#e8c547", moutarde: "#c9a227",
  orange: "#d9772e", corail: "#e57a5f",
  gris: "#8c8c8c", anthracite: "#3a3a3a", "gris clair": "#c4c4c4", "gris foncé": "#4a4a4a",
  marron: "#6b4226", chocolat: "#4a2c17", camel: "#c19a6b", cognac: "#9a463d", taupe: "#8b7d6b",
  violet: "#6c3483", mauve: "#b39ddb", lilas: "#c8a2c8",
  doré: "#c9a635", or: "#c9a635", argenté: "#c0c0c0", argent: "#c0c0c0",
  nude: "#e3bfa5", crème: "#f2e9dc", ivoire: "#f5f0e6",
};

function getSwatchColor(label: string): string | null {
  const key = label.trim().toLowerCase();
  return COLOR_MAP[key] || null;
}

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
          {variantes.some((v) => getSwatchColor(v.name || v.title || "")) ? "Couleur" : "Choix de la variante"}
        </span>
        <div className="flex flex-wrap items-center gap-3">
          {variantes.map((v: any) => {
            const label = v.name || v.title || "Option";
            const isSelected = selectedVariante?.id === v.id;
            const disabled = (v.stock ?? 0) === 0;
            const swatchColor = getSwatchColor(label);

            if (swatchColor) {
              return (
                <button
                  key={v.id || label}
                  type="button"
                  onClick={() => onSelectVariante(v)}
                  disabled={disabled}
                  title={label}
                  className={`relative w-10 h-10 rounded-full transition-all duration-200 border-2 shrink-0
                    ${isSelected ? "border-[#2C2224] scale-110 shadow-md" : "border-white shadow-sm hover:scale-105"}
                    ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  `}
                  style={{
                    backgroundColor: swatchColor,
                    boxShadow: isSelected ? undefined : "0 0 0 1px rgba(0,0,0,0.08)",
                  }}
                >
                  {disabled && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-full h-px bg-red-500 rotate-45" />
                    </span>
                  )}
                  {!disabled && v.stock <= 3 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                      {v.stock}
                    </span>
                  )}
                </button>
              );
            }

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
        {(() => {
          const selectedLabel = selectedVariante ? (selectedVariante.name || selectedVariante.title || "") : "";
          return variantes.some((v) => getSwatchColor(v.name || v.title || "")) && selectedLabel ? (
            <p className="text-[10px] font-mono text-gray-500">Sélection : <strong className="text-[#2C2224]">{selectedLabel}</strong></p>
          ) : null;
        })()}
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
            {models.some((m) => getSwatchColor(m)) ? "Couleur" : "Modèle"}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {models.map((m) => {
              const swatchColor = getSwatchColor(m);
              // Stock de la combinaison (poids sélectionné + ce modèle), pour griser/barrer si en rupture.
              const matchingVariante = variantes.find((v) => {
                const label = v.name || v.title || "";
                if (label.includes(selectedWeight) && label.includes(m)) return true;
                if (v.combo) {
                  const vals = Object.values(v.combo).map((val) => String(val));
                  return vals.includes(selectedWeight) && vals.includes(m);
                }
                return false;
              });
              const stock = matchingVariante?.stock;
              const outOfStock = matchingVariante && stock === 0;

              if (swatchColor) {
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedModel(m)}
                    disabled={outOfStock}
                    title={m}
                    className={`relative w-10 h-10 rounded-full transition-all duration-200 border-2 shrink-0
                      ${m === selectedModel ? "border-[#2C2224] scale-110 shadow-md" : "border-white shadow-sm hover:scale-105"}
                      ${outOfStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                    `}
                    style={{
                      backgroundColor: swatchColor,
                      boxShadow: m === selectedModel ? undefined : "0 0 0 1px rgba(0,0,0,0.08)",
                    }}
                  >
                    {outOfStock && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-px bg-red-500 rotate-45" />
                      </span>
                    )}
                    {!outOfStock && typeof stock === "number" && stock <= 3 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                        {stock}
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedModel(m)}
                  disabled={outOfStock}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full text-[11px] font-mono transition-all duration-200 border
                    ${m === selectedModel
                      ? "bg-white text-[#2C2224] border-[#2C2224] shadow-md font-bold"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }
                    ${outOfStock ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  <span>{m}</span>
                </button>
              );
            })}
          </div>
          {(() => {
            return models.some((m) => getSwatchColor(m)) && selectedModel ? (
              <p className="text-[10px] font-mono text-gray-500">Sélection : <strong className="text-[#2C2224]">{selectedModel}</strong></p>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}