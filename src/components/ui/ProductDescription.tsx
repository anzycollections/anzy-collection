"use client";

import { useState } from "react";

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const text =
    description ||
    "Conçue pour garantir un maintien subtil et invisible sous vos tenues, alliant aisance et raffinement.";

  const isLongText = text.length > 150;

  return (
    <div className="space-y-1">
      <span className="text-[9px] font-mono tracking-[0.15em] text-gray-400 uppercase font-medium block">
        DESCRIPTION
      </span>
      <div className="relative">
        <p
          className={`text-[11px] font-sans font-light text-gray-500 leading-relaxed whitespace-pre-line transition-all duration-300 ${
            !isExpanded ? "line-clamp-4" : ""
          }`}
        >
          {text}
        </p>

        {isLongText && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[9px] font-mono font-semibold text-[#2C2224] uppercase tracking-wider mt-2 hover:text-[#E88D9E] transition-colors cursor-pointer flex items-center gap-1"
          >
            {isExpanded ? "- Réduire" : "+ Lire la suite"}
          </button>
        )}
      </div>
    </div>
  );
}
