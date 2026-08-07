"use client";

import { OTHER_COUNTRIES } from "@/data/otherCountries";

interface CustomerInfoProps {
  formData: any;
  handleInputChange: any;
  isOther: boolean;
  countryName: string;
  customCountryName: string;
  setCustomCountryName: (name: string) => void;
  localShippingOptions: any[];
  localSelectedShipping: any;
  setLocalSelectedShipping: any;
  effectiveShipping: any;
  selectedShipping: any;
}

export default function CustomerInfo({
  formData, handleInputChange, isOther, countryName,
  customCountryName, setCustomCountryName,
  localShippingOptions, localSelectedShipping, setLocalSelectedShipping,
  effectiveShipping, selectedShipping,
}: CustomerInfoProps) {
  return (
    <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="font-serif font-bold text-lg mb-6 border-b pb-4">1. Vos coordonnees</h2>
      <div className="space-y-4">
        <div className="relative">
          <input type="text" name="name" placeholder="Nom complet" required value={formData.name} onChange={handleInputChange} className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:border-[#E88D9E] outline-none" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 text-lg">*</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:border-[#E88D9E] outline-none" />
          <div className="relative">
            <input type="tel" name="phone" placeholder="Telephone / WhatsApp" required value={formData.phone} onChange={handleInputChange} className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:border-[#E88D9E] outline-none" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 text-lg">*</span>
          </div>
        </div>
        <div className="relative">
          <input type="text" name="address" placeholder="Adresse de livraison" required value={formData.address} onChange={handleInputChange} className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:border-[#E88D9E] outline-none" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 text-lg">*</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input type="text" name="city" placeholder="Ville" required value={formData.city} onChange={handleInputChange} className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:border-[#E88D9E] outline-none" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 text-lg">*</span>
          </div>
          <div className="relative">
            {isOther ? (
              <>
                <select
                  value={customCountryName}
                  onChange={(e) => setCustomCountryName(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:border-[#E88D9E] outline-none"
                >
                  <option value="">-- Choisissez votre pays --</option>
                  {OTHER_COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-red-400 text-lg">*</span>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={countryName}
                  readOnly
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-700 cursor-default"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">&#10003;</span>
              </>
            )}
          </div>
        </div>

        {!isOther && selectedShipping && (
          <div className="mt-4 p-4 bg-[#FAF7F5] rounded-xl border">
            <p className="text-sm font-semibold">Livraison : {selectedShipping.name}</p>
            <p className="text-xs text-gray-500">{selectedShipping.price.toLocaleString()} F CFA</p>
          </div>
        )}

        {isOther && localShippingOptions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Mode de livraison <span className="text-red-400">*</span></h3>
            <div className="space-y-2">
              {localShippingOptions.map(opt => (
                <label key={opt.id} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${localSelectedShipping?.id === opt.id ? "border-[#E88D9E] bg-[#FFF5F7]" : "border-gray-200 hover:border-gray-300"}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shippingLocal" checked={localSelectedShipping?.id === opt.id} onChange={() => setLocalSelectedShipping(opt)} className="accent-[#E88D9E]" />
                    <div>
                      <p className="text-sm font-medium">{opt.name}</p>
                      {opt.carrier && <p className="text-[10px] text-gray-400">{opt.carrier}</p>}
                    </div>
                  </div>
                  <span className="text-sm font-bold">{opt.price.toLocaleString()} F CFA</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-gray-600">Note / Commentaire (optionnel)</label>
          <textarea
            name="comment"
            rows={3}
            value={formData.comment}
            onChange={handleInputChange}
            className="w-full mt-1 p-3 rounded-xl border border-gray-200 text-sm focus:border-[#E88D9E] outline-none"
            placeholder="Precisions sur votre commande..."
          />
        </div>
      </div>
    </section>
  );
}