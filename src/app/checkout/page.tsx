"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, subtotal, total, country, selectedShipping } = useCart();
  const { convertirPrix, symboleDevise } = useStore();
  const router = useRouter();

  // Redirection si le panier est vide
  if (items.length === 0) {
    if (typeof window !== "undefined") router.push("/");
    return null;
  }

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", city: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [operator, setOperator] = useState("MTN Money");
  const [reference, setReference] = useState("");
  const [uploading, setUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Cette fonction sera connectée à Vercel Blob à l'étape suivante
    setUploading(true);
    setTimeout(() => {
      setReceiptUrl("mock_url_for_now");
      setUploading(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Logique d'envoi à la base de données (étape suivante)
    setTimeout(() => {
      alert("Commande validée ! Nous allons créer l'API pour enregistrer ça.");
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] font-sans text-[#2C2224]">
      {/* HEADER MINIMALISTE */}
      <header className="bg-white border-b border-[#E88D9E]/15 py-5 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="text-xs font-mono font-bold text-gray-500 hover:text-[#E88D9E] transition-colors flex items-center gap-2 uppercase tracking-wider">
          <span>←</span> Retour à la boutique
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 text-center hidden sm:block">
          <h1 className="text-lg font-serif font-bold tracking-[0.2em] uppercase">ANZY COLLECTION</h1>
          <span className="text-[7px] font-mono tracking-[0.25em] text-[#E88D9E] uppercase">Paiement Sécurisé</span>
        </div>
        <div className="w-20" /> {/* Spacer pour centrer le logo */}
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* COLONNE GAUCHE : FORMULAIRES */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Étape 1 : Coordonnées */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="font-serif font-bold text-lg mb-6 border-b border-gray-100 pb-4">1. Vos Coordonnées</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Nom et Prénom" required className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:border-[#E88D9E] outline-none" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="email" placeholder="Adresse e-mail" required className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:border-[#E88D9E] outline-none" />
                  <input type="tel" placeholder="Téléphone / WhatsApp" required className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:border-[#E88D9E] outline-none" />
                </div>
                <input type="text" placeholder="Adresse de livraison complète" required className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:border-[#E88D9E] outline-none" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Ville" required className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:border-[#E88D9E] outline-none" />
                  <input type="text" value={country} disabled className="w-full p-3.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
              </div>
            </section>

            {/* Étape 2 : Paiement & Preuve */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="font-serif font-bold text-lg mb-6 border-b border-gray-100 pb-4">2. Paiement & Reçu</h2>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button type="button" onClick={() => setPaymentMethod("mobile_money")} className={`py-3 text-xs font-mono font-bold rounded-xl border transition-all ${paymentMethod === "mobile_money" ? "bg-[#2C2224] text-white border-[#2C2224]" : "bg-white text-gray-500 border-gray-200 hover:border-[#E88D9E]"}`}>
                  MOBILE MONEY
                </button>
                <button type="button" onClick={() => setPaymentMethod("transfer")} className={`py-3 text-xs font-mono font-bold rounded-xl border transition-all ${paymentMethod === "transfer" ? "bg-[#2C2224] text-white border-[#2C2224]" : "bg-white text-gray-500 border-gray-200 hover:border-[#E88D9E]"}`}>
                  TRANSFERT
                </button>
              </div>

              <div className="space-y-5">
                <select value={operator} onChange={e => setOperator(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#E88D9E] outline-none">
                  {paymentMethod === "mobile_money" ? (
                    <>
                      <option value="MTN Money">MTN Money (Bénin / CI)</option>
                      <option value="Moov Money">Moov Money</option>
                      <option value="Orange Money">Orange Money</option>
                      <option value="Wave">Wave</option>
                    </>
                  ) : (
                    <>
                      <option value="MoneyGram">MoneyGram</option>
                      <option value="Ria">Ria</option>
                      <option value="Western Union">Western Union</option>
                    </>
                  )}
                </select>

                <div className="bg-[#FAF7F5] p-4 rounded-xl border border-gray-200 text-sm text-gray-600">
                  <p>Veuillez effectuer le paiement de <strong className="text-[#E88D9E]">{convertirPrix(total)} {symboleDevise}</strong> sur notre compte <strong>{operator}</strong>.</p>
                  <p className="mt-2 text-xs font-mono">Numéro / Info : (+229) 00 00 00 00</p>
                </div>

                <input type="text" placeholder="Référence de transaction (ID SMS, MTCN...)" required className="w-full p-3.5 rounded-xl border border-gray-200 text-sm font-mono focus:border-[#E88D9E] outline-none" />

                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Photo du reçu / Capture d'écran</label>
                  <input type="file" required accept="image/*" onChange={handleFileUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#E88D9E]/10 file:text-[#E88D9E] hover:file:bg-[#E88D9E]/20 transition-all cursor-pointer" />
                  {uploading && <p className="text-[10px] text-[#E88D9E] font-mono mt-2">Chargement de l'image...</p>}
                </div>
              </div>
            </section>
          </div>

          {/* COLONNE DROITE : RÉSUMÉ DE LA COMMANDE */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg shadow-[#E88D9E]/5 border border-[#E88D9E]/20 sticky top-24">
              <h2 className="font-serif font-bold text-lg mb-6">Résumé de la commande</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="relative">
                      <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded-xl border border-gray-100" />
                      <span className="absolute -top-2 -right-2 bg-[#2C2224] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{item.productName}</p>
                      {item.varianteName && <p className="text-[10px] text-gray-500">{item.varianteName}</p>}
                    </div>
                    <p className="text-sm font-mono font-bold">{convertirPrix(item.price * item.quantity)} {symboleDevise}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total articles</span>
                  <span className="font-mono">{convertirPrix(subtotal)} {symboleDevise}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison ({country})</span>
                  <span className="font-mono">{convertirPrix(total - subtotal)} {symboleDevise}</span>
                </div>
              </div>

              <div className="border-t border-[#E88D9E]/30 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-base uppercase tracking-wider">Total</span>
                <span className="text-xl font-mono font-bold text-[#E88D9E]">{convertirPrix(total)} {symboleDevise}</span>
              </div>

              <button type="submit" disabled={submitting} className="w-full mt-8 bg-[#2C2224] text-white py-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-widest shadow-xl hover:bg-[#E88D9E] transition-all disabled:opacity-50">
                {submitting ? "Validation en cours..." : "CONFIRMER ET PAYER"}
              </button>
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}
