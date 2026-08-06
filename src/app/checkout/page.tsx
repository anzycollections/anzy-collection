"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import {
  COUNTRIES,
  getShippingOptions,
  ShippingOption,
  TERRESTRE_INSURANCE_PRICE,
} from "@/lib/shipping";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { convertirPrix, symboleDevise } = useStore();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    countryCode: "BJ",
    city: "",
    address: "",
  });

  const [selectedOptionId, setSelectedOptionId] = useState<string>("dhl_express");
  const [addTerrestreInsurance, setAddTerrestreInsurance] = useState<boolean>(false);

  const availableOptions = getShippingOptions(form.countryCode);
  const selectedOption = availableOptions.find((o) => o.id === selectedOptionId) || availableOptions[0];

  // Calcul du coût de livraison
  let shippingCost = selectedOption?.price || 0;
  if (selectedOption?.carrier === "Terrestre" && addTerrestreInsurance) {
    shippingCost += TERRESTRE_INSURANCE_PRICE;
  }

  const grandTotal = totalPrice + shippingCost;
  const grandTotalConverted = convertirPrix(grandTotal);
  const deviseAffichee = symboleDevise === "F CFA" ? "F CFA" : symboleDevise;

  const handleCountryChange = (code: string) => {
    setForm({ ...form, countryCode: code });
    const opts = getShippingOptions(code);
    if (opts.length > 0) {
      setSelectedOptionId(opts[0].id);
    }
  };

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCountryName = COUNTRIES.find((c) => c.code === form.countryCode)?.name || form.countryCode;

    let deliveryDetail = selectedOption.name;
    if (selectedOption.carrier === "Terrestre") {
      deliveryDetail += addTerrestreInsurance ? " (Avec Assurance +8 000 F)" : " (Sans Assurance)";
    }

    let message = `*NOUVELLE COMMANDE - ANZY COLLECTION*\n\n`;
    message += `👤 *Client:* ${form.fullName}\n`;
    message += `📞 *Téléphone:* ${form.phone}\n`;
    message += `📍 *Adresse:* ${form.address}, ${form.city} (${selectedCountryName})\n\n`;
    message += `🛍️ *ARTICLES:*\n`;

    cart.forEach((item) => {
      message += `• ${item.productName} (${item.varianteName}) x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} F CFA\n`;
    });

    message += `\n🚚 *Mode de Livraison:* ${deliveryDetail}\n`;
    message += `💵 *Frais de livraison:* ${convertirPrix(shippingCost).toLocaleString()} ${deviseAffichee}\n`;
    message += `💰 *TOTAL FINAL:* ${grandTotalConverted.toLocaleString()} ${deviseAffichee}\n`;

    const whatsappUrl = `https://wa.me/22900000000?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, "_blank");
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <span className="text-5xl mb-4">🛍️</span>
        <h1 className="text-2xl font-serif font-bold text-[#2C2224] mb-2">Votre panier est vide</h1>
        <p className="text-xs text-gray-500 mb-6">Ajoutez des pièces d'exception à votre panier pour finaliser votre commande.</p>
        <a href="/" className="px-8 py-3 rounded-full bg-[#E88D9E] text-white text-xs font-mono uppercase tracking-wider font-semibold">
          Retour au catalogue
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] py-12 px-4 sm:px-6 lg:px-8 text-[#2C2224]">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* FORMULAIRE CLIENT */}
        <form onSubmit={handleSendOrder} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <h2 className="text-xl font-serif font-bold border-b border-gray-100 pb-3">Coordonnées de livraison</h2>

          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-1">Nom Complet *</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none"
              placeholder="Ex: Sarah KONE"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-1">Téléphone / WhatsApp *</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none"
              placeholder="+229 90 00 00 00"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-1">Pays de destination *</label>
            <select
              value={form.countryCode}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#E88D9E] focus:outline-none"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-1">Ville *</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none"
                placeholder="Cotonou"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-1">Adresse *</label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none"
                placeholder="Quartier, Rue..."
              />
            </div>
          </div>

          {/* SÉLECTION MODE DE LIVRAISON */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block">
              Option de Livraison
            </label>

            {availableOptions.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected ? "border-[#E88D9E] bg-[#FAF7F5]" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{opt.name}</span>
                    <span className="text-[#E88D9E]">{convertirPrix(opt.price).toLocaleString()} {deviseAffichee}</span>
                  </div>

                  {opt.carrier === "Terrestre" && isSelected && (
                    <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between">
                      <label className="text-[11px] font-medium text-gray-600 flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addTerrestreInsurance}
                          onChange={(e) => setAddTerrestreInsurance(e.target.checked)}
                          className="rounded border-gray-300 text-[#E88D9E] focus:ring-[#E88D9E]"
                        />
                        Ajouter l'assurance de livraison (+8 000 F)
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-mono uppercase text-xs tracking-widest font-bold shadow-lg hover:bg-green-700 transition"
          >
            💬 Valider la commande via WhatsApp
          </button>
        </form>

        {/* RÉCAPITULATIF COMMANDE */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6 h-fit">
          <h2 className="text-xl font-serif font-bold border-b border-gray-100 pb-3">Récapitulatif</h2>

          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.varianteId} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold">{item.productName}</p>
                  <p className="text-[10px] text-gray-400 font-mono">{item.varianteName} (x{item.quantity})</p>
                </div>
                <span className="font-semibold">{convertirPrix(item.price * item.quantity).toLocaleString()} {deviseAffichee}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Articles</span>
              <span>{convertirPrix(totalPrice).toLocaleString()} {deviseAffichee}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Livraison</span>
              <span>{convertirPrix(shippingCost).toLocaleString()} {deviseAffichee}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#2C2224] pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-[#E88D9E] text-base">{grandTotalConverted.toLocaleString()} {deviseAffichee}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
