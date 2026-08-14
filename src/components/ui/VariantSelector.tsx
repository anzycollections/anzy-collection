"use client";

import { useMemo, useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";

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
  const { t } = useStore();
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

  const hasCombo = variantes.some((v) => v.combo && Object.keys(v.combo).length > 0);
  const hasLegacySeparator = variantes.some((v) => {
    const l = v.name || v.title || "";
    return l.includes(" - ") || l.includes(" / ") || l.includes(" – ");
  });

  // Un "axe" = une vraie option nommée par la vendeuse (Couleur, Taille, Poids...).
  // Chaque axe obtient sa propre section à l'écran, avec ses propres valeurs
  // dédupliquées — au lieu de tout mélanger en devinant "poids vs modèle".
  const axes = useMemo(() => {
    if (hasCombo) {
      const map: Record<string, Set<string>> = {};
      const order: string[] = [];
      variantes.forEach((v) => {
        if (!v.combo) return;
        Object.entries(v.combo).forEach(([key, val]) => {
          if (!map[key]) { map[key] = new Set(); order.push(key); }
          map[key].add(String(val));
        });
      });
      return order.map((key) => ({ key, values: Array.from(map[key]) }));
    }
    if (hasLegacySeparator) {
      const w = new Set<string>();
      const m = new Set<string>();
      variantes.forEach((v) => {
        const label = v.name || v.title || "";
        const sep = label.includes(" / ") ? " / " : (label.includes(" - ") ? " - " : (label.includes(" – ") ? " – " : null));
        if (sep) {
          const [p, mo] = label.split(sep);
          w.add(p.trim());
          m.add(mo.trim());
        }
      });
      return [
        { key: "Poids", values: Array.from(w) },
        { key: "Modèle", values: Array.from(m) },
      ].filter((a) => a.values.length > 0);
    }
    // Système simple d'origine : une variante = une option directe (ex: juste des couleurs, sans deuxième critère).
    return [{ key: "__flat__", values: variantes.map((v) => getVarianteLabel(v)) }];
  }, [variantes, hasCombo, hasLegacySeparator]);

  const [selected, setSelected] = useState<Record<string, string>>({});

  const findMatchingVariante = (sel: Record<string, string>) => {
    if (axes.length === 1 && axes[0].key === "__flat__") {
      return variantes.find((v) => getVarianteLabel(v) === sel.__flat__);
    }
    if (hasCombo) {
      return variantes.find(
        (v) => v.combo && axes.every((ax) => sel[ax.key] === undefined || String(v.combo[ax.key]) === sel[ax.key])
      );
    }
    return variantes.find((v) => {
      const label = v.name || v.title || "";
      return (sel["Poids"] === undefined || label.includes(sel["Poids"])) &&
             (sel["Modèle"] === undefined || label.includes(sel["Modèle"]));
    });
  };

  // Resynchronise la sélection locale quand le tiroir s'ouvre sur une variante précise
  // (ex: on modifie un article déjà dans le panier).
  useEffect(() => {
    if (!selectedVariante) return;
    if (axes.length === 1 && axes[0].key === "__flat__") {
      setSelected({ __flat__: getVarianteLabel(selectedVariante) });
    } else if (hasCombo && selectedVariante.combo) {
      const next: Record<string, string> = {};
      axes.forEach((ax) => {
        if (selectedVariante.combo[ax.key] !== undefined) next[ax.key] = String(selectedVariante.combo[ax.key]);
      });
      setSelected(next);
    } else {
      const label = selectedVariante.name || selectedVariante.title || "";
      const sep = label.includes(" / ") ? " / " : (label.includes(" - ") ? " - " : (label.includes(" – ") ? " – " : null));
      if (sep) {
        const [p, m] = label.split(sep);
        setSelected({ "Poids": p.trim(), "Modèle": m.trim() });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariante?.id]);

  // Dès que la sélection locale change (clic sur un swatch), on cherche la variante
  // correspondante et on prévient le parent si elle a changé.
  useEffect(() => {
    const found = findMatchingVariante(selected);
    if (found && found.id !== selectedVariante?.id) {
      onSelectVariante(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const renderAxisLabel = (key: string) => (key === "__flat__" ? t("variant.genericChoice") : key);

  return (
    <div className="space-y-6">
      {axes.map((axis) => {
        const isColorAxis = axis.values.some((v) => resolveColor(v));
        return (
          <div key={axis.key} className="space-y-2.5">
            <span className="text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase font-medium">
              {isColorAxis ? (axis.key === "__flat__" ? t("variant.colorAxis") : axis.key) : renderAxisLabel(axis.key)}
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {axis.values.map((value) => {
                const bgColor = resolveColor(value);
                const isSelected = selected[axis.key] === value;
                // Variante qui résulterait de ce choix (les autres axes restant tels quels), pour le stock.
                const candidate = findMatchingVariante({ ...selected, [axis.key]: value });
                const stock = candidate?.stock;
                const disabled = candidate ? (candidate.stock ?? 0) === 0 : false;

                if (bgColor) {
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelected((prev) => ({ ...prev, [axis.key]: value }))}
                      disabled={disabled}
                      title={value}
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
                      {!disabled && typeof stock === "number" && stock <= 3 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                          {stock}
                        </span>
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelected((prev) => ({ ...prev, [axis.key]: value }))}
                    disabled={disabled}
                    className={`relative px-5 py-3 rounded-2xl text-[11px] font-mono transition-all duration-200 border
                      ${isSelected
                        ? "bg-[#2C2224] text-white border-[#2C2224] shadow-md scale-105"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm"
                      }
                      ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    `}
                  >
                    {value}
                    {!disabled && typeof stock === "number" && stock <= 3 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {stock}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}