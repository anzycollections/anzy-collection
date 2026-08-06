"use client";

import { useMemo } from "react";

interface VariantSelectorProps {
  variantes: any[];
  selectedVariante: any;
  onSelectVariante: (v: any) => void;
}

export default function VariantSelector({
  variantes,
  selectedVariante,
  onSelectVariante,
}: VariantSelectorProps) {
  
  const parsedVariants = useMemo(() => {
    const weights = new Set<string>();
    const colors = new Set<string>();

    variantes.forEach((v) => {
      let label = v.name || v.title || "";
      if (label.includes(" / ")) {
        const [weight, color] = label.split(" / ");
        weights.add(weight.trim());
        colors.add(color.trim());
      } else if (v.combo) {
        Object.values(v.combo).forEach((val: any) => {
            if(val.includes("kg") || !isNaN(val)) weights.add(val)
            else colors.add(val)
        })
      } else {
          weights.add(label);
      }
    });

    return {
      weights: Array.from(weights),
      colors: Array.from(colors),
      isComplex: weights.size > 0 && colors.size > 0
    };
  }, [variantes]);

  if (!parsedVariants.isComplex) {
    return (
      <div className="space-y-2">
        <span className="text-[9px] font-mono tracking-[0.15em] text-gray-400 uppercase font-medium block">
          TAILLE / OPTION
        </span>
        <div className="flex flex-wrap gap-1.5">
          {variantes.map((v: any, idx: number) => {
            const label = v.name || v.title || "Option";
            const isSelected = selectedVariante?.id === v.id;
            return (
              <button
                key={v.id || idx}
                onClick={() => onSelectVariante(v)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition border cursor-pointer ${
                  isSelected
                    ? "bg-[#2C2224] text-white border-[#2C2224] shadow-2xs"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const currentLabel = selectedVariante?.name || selectedVariante?.title || "";
  const [currentWeight, currentColor] = currentLabel.includes(" / ") 
    ? currentLabel.split(" / ").map((s:string) => s.trim()) 
    : [parsedVariants.weights[0], parsedVariants.colors[0]];

  const handleSelect = (type: "weight" | "color", value: string) => {
      const newWeight = type === "weight" ? value : currentWeight;
      const newColor = type === "color" ? value : currentColor;
      const targetLabel = `${newWeight} / ${newColor}`;
      
      const foundVariant = variantes.find(v => (v.name || v.title) === targetLabel);
      if(foundVariant) {
          onSelectVariante(foundVariant);
      }
  };

  return (
    <div className="space-y-4">
      {parsedVariants.colors.length > 0 && (
          <div className="space-y-2">
            <span className="text-[9px] font-mono tracking-[0.15em] text-gray-400 uppercase font-medium block">
              COULEUR
            </span>
            <div className="flex flex-wrap gap-1.5">
                {parsedVariants.colors.map(color => (
                    <button
                        key={color}
                        onClick={() => handleSelect("color", color)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition border cursor-pointer ${
                        color === currentColor
                            ? "bg-white text-[#2C2224] border-[#2C2224] shadow-sm font-bold"
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        {color}
                    </button>
                ))}
            </div>
          </div>
      )}

      {parsedVariants.weights.length > 0 && (
          <div className="space-y-2">
            <span className="text-[9px] font-mono tracking-[0.15em] text-gray-400 uppercase font-medium block">
              POIDS
            </span>
            <div className="flex flex-wrap gap-1.5">
                {parsedVariants.weights.map(weight => (
                    <button
                        key={weight}
                        onClick={() => handleSelect("weight", weight)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition border cursor-pointer ${
                        weight === currentWeight
                            ? "bg-[#2C2224] text-white border-[#2C2224] shadow-sm"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        {weight}
                    </button>
                ))}
            </div>
          </div>
      )}
    </div>
  );
}
