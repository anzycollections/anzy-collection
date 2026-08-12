"use client";

import { useMemo, useState, useEffect } from "react";

interface VariantSelectorProps {
  variantes: any[];
  selectedVariante: any;
  onSelectVariante: (v: any) => void;
  currency?: string;
  productOptions?: { name: string; values: string[]; colorMap?: Record<string, string> }[];
}

// Dictionnaire associant le nom du modèle à une couleur HEX.
// Les codes A/B/C correspondent aux teintes de peau des prothèses (tel que déjà configuré).
// Les noms de couleur usuels sont ajoutés en complément, pour les produits qui utilisent
// des noms complets ("Noir", "Beige"...) plutôt que des codes lettrés.
const colorMap: Record<string, string> = {
  "A": "#E2C3AF", // Teinte claire
  "B": "#B9856A", // Teinte moyenne
  "C": "#845A48", // Teinte foncée
  noir: "#1a1a1a", ébène: "#0d0d0d",
  blanc: "#ffffff", ivoire: "#f5f0e6", crème: "#f2e9dc", écru: "#f0e6d2",
  beige: "#e8dcc8", sable: "#e0c9a6", nude: "#e3bfa5",
  rose: "#e88d9e", fuchsia: "#c2185b", magenta: "#c71585",
  rouge: "#c0392b", bordeaux: "#6d2130", corail: "#e5674c", brique: "#a13d2b",
  bleu: "#2c4a7c", marine: "#1b2a4a", ciel: "#a9cce3", turquoise: "#1abc9c", indigo: "#3f3d9e",
  vert: "#3f6b4f", kaki: "#6b6b47", olive: "#6b6b47", émeraude: "#046307", menthe: "#98d8c8",
  jaune: "#e8c547", moutarde: "#c9a227", citron: "#f4e04d",
  orange: "#d9772e", abricot: "#e8a55c",
  gris: "#8c8c8c", anthracite: "#3a3a3a", argenté: "#c0c0c0", argent: "#c0c0c0", perle: "#e6e2df",
  marron: "#6b4226", chocolat: "#4a2c17", camel: "#c19a6b", cognac: "#9a463d", taupe: "#8b7d6b", caramel: "#af6f3e",
  violet: "#6c3483", mauve: "#b39ddb", lilas: "#c8a2c8", prune: "#5b2333",
  doré: "#c9a635", or: "#c9a635", bronze: "#8c6a3f", cuivre: "#b56a3c",
};

// Retire les accents pour une comparaison plus tolérante (ex: "dore" trouve "doré").
function normalize(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

const normalizedColorMap: Record<string, string> = Object.fromEntries(
  Object.entries(colorMap).map(([k, v]) => [normalize(k), v])
);

function getSwatchColor(label: string): string | null {
  if (colorMap[label]) return colorMap[label]; // codes A/B/C exacts, sensibles à la casse
  const norm = normalize(label);
  if (normalizedColorMap[norm]) return normalizedColorMap[norm];
  // Correspondance partielle : "Rouge vif", "Bleu clair", "Vert foncé" contiennent un mot-clé connu.
  const found = Object.keys(normalizedColorMap).find((key) => norm.includes(key));
  return found ? normalizedColorMap[found] : null;
}

// Libellé fiable d'une variante : utilise name/title s'ils existent, sinon
// reconstruit un libellé lisible à partir de combo (généré par le nouveau
// système "Options & pré-tarification" de l'admin). C'est ce qui manquait
// et causait l'affichage générique "Option" au lieu du vrai nom.
function getVarianteLabel(v: any): string {
  if (v.name) return v.name;
  if (v.title) return v.title;
  if (v.combo) {
    const vals = Object.values(v.combo).map((val: any) => String(val));
    if (vals.length > 0) return vals.join(" / ");
  }
  return "Option";
}

export default function VariantSelector({
  variantes,
  selectedVariante,
  onSelectVariante,
  currency = "XOF",
  productOptions,
}: VariantSelectorProps) {
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  // Couleur exacte choisie par la vendeuse dans l'admin pour cette valeur précise
  // (ex: "Rouge" -> "#c0392b" tel qu'elle l'a réellement sélectionné), prioritaire
  // sur la devinette par dictionnaire ci-dessous. Si rien n'a été choisi pour
  // cette valeur, on retombe automatiquement sur la devinette — donc les anciens
  // produits jamais mis à jour continuent de s'afficher comme avant.
  const getExactColor = (value: string): string | null => {
    if (!productOptions) return null;
    for (const opt of productOptions) {
      if (opt.colorMap && opt.colorMap[value]) return opt.colorMap[value];
    }
    return null;
  };

  const resolveColor = (value: string): string | null => getExactColor(value) || getSwatchColor(value);

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

  useEffect(() => {
    if (!isComplex) return;

    const found = variantes.find((v) => {
      const label = v.name || v.title || "";
      if (label && label.includes(selectedWeight) && label.includes(selectedModel)) return true;
      
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
          {variantes.some((v) => resolveColor(v.name || v.title || "")) ? "Couleur" : "Choix de la variante"}
        </span>
        <div className="flex flex-wrap items-center gap-3">
          {variantes.map((v: any) => {
            const label = getVarianteLabel(v);
            const isSelected = selectedVariante?.id === v.id;
            const disabled = (v.stock ?? 0) === 0;
            const bgColor = resolveColor(label);

            if (bgColor) {
              return (
                <button
                  key={v.id || label}
                  type="button"
                  onClick={() => onSelectVariante(v)}
                  disabled={disabled}
                  title={label}
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 focus:outline-none
                    ${isSelected ? "ring-[1.5px] ring-offset-2 ring-[#2C2224] scale-110 shadow-sm" : "ring-1 ring-gray-200/50 hover:ring-gray-300 hover:scale-105"}
                    ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  `}
                  style={{ backgroundColor: bgColor }}
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
            Modèle / Couleur
          </span>
          <div className="flex flex-wrap gap-3">
            {models.map((m) => {
              // Récupération de la couleur depuis le dictionnaire. Si elle n'existe pas, on met un gris par défaut.
              const bgColor = resolveColor(m) || "#E5E7EB";
              const isSelected = m === selectedModel;

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

              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedModel(m)}
                  disabled={outOfStock}
                  // Le style Tailwind ci-dessous crée l'effet "Swatch" parfait (rond coloré, anneau extérieur si sélectionné)
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 focus:outline-none
                    ${isSelected ? "ring-[1.5px] ring-offset-2 ring-[#2C2224] scale-110 shadow-sm" : "ring-1 ring-gray-200/50 hover:ring-gray-300 hover:scale-105"}
                    ${outOfStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  `}
                  title={`Modèle ${m}`} // Affiche le nom (ex: "Modèle A") au survol de la souris
                  style={{ backgroundColor: bgColor }}
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
            })}
          </div>
        </div>
      )}
    </div>
  );
}