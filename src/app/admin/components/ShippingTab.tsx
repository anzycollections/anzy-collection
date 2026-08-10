"use client";

import { useState, useEffect } from "react";
import { DEFAULT_SHIPPING_PRICES } from "@/data/shippingZones";

// La colonne "shippingPrices" en base s'initialise à un objet vide {} (pas à
// "rien du tout"), et {} est une valeur "vraie" en JavaScript — donc l'ancien
// code pensait à tort qu'il y avait déjà des prix personnalisés, alors qu'il
// n'y avait rien à afficher. Cette fonction distingue "vraiment vide" de
// "a de vrais prix enregistrés".
function resolvePrices(saved: any): Record<string, number> {
  if (saved && typeof saved === "object" && Object.keys(saved).length > 0) {
    return saved;
  }
  return DEFAULT_SHIPPING_PRICES;
}

export default function ShippingTab({ content, saveContent }: { content: any; saveContent: (c: any) => void }) {
  const [shippingForm, setShippingForm] = useState<Record<string, number>>(
    resolvePrices(content?.shippingPrices)
  );
  const [shippingSaved, setShippingSaved] = useState(false);

  // Le contenu arrive parfois après le premier affichage (chargement en
  // arrière-plan) : on se resynchronise dès qu'il est disponible.
  useEffect(() => {
    if (content?.shippingPrices && Object.keys(content.shippingPrices).length > 0) {
      setShippingForm(content.shippingPrices);
    }
  }, [content?.shippingPrices]);

  const saveShipping = () => {
    saveContent({ ...content, shippingPrices: shippingForm });
    setShippingSaved(true);
    setTimeout(() => setShippingSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="border-b border-gray-100 pb-3">
        <span className="text-[9px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold">SECTION 03</span>
        <h2 className="text-xl font-serif font-bold text-[#2C2224]">Tarifs de Livraison par Pays</h2>
        <p className="text-xs text-gray-500 mt-1">Modifiez les prix de transport. Les changements s'appliquent instantanément sur le site.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(shippingForm).map((country) => (
          <div key={country} className="p-4 rounded-2xl border border-gray-200 bg-[#FAF7F5]/50 space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold block">
              {country}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={shippingForm[country]}
                onChange={(e) => setShippingForm({ ...shippingForm, [country]: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold bg-white focus:border-[#E88D9E] focus:outline-none"
              />
              <span className="text-xs font-mono text-gray-400">XOF</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={saveShipping}
        className={`w-full py-4 rounded-2xl text-[11px] font-mono font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer ${
          shippingSaved ? "bg-green-600 text-white scale-102" : "bg-[#2C2224] text-white hover:bg-black"
        }`}
      >
        {shippingSaved ? "✓ MODIFICATIONS ENREGISTRÉES" : "ENREGISTRER LES TARIFS DE LIVRAISON"}
      </button>
    </div>
  );
}
