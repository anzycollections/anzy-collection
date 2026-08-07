"use client";

import { useEffect } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import CustomerInfo from "@/components/checkout/CustomerInfo";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useRouter } from "next/navigation";
import { useCartUI } from "@/context/CartUIContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { openCart, closeCart } = useCartUI();
  const checkout = useCheckout();

  useEffect(() => {
    closeCart();
  }, []);

  if (checkout.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-2xl font-serif font-bold">Votre panier est vide</h1>
          <p className="text-gray-500">Ajoutez des produits pour continuer.</p>
          <a href="/" className="inline-block bg-[#E88D9E] text-white px-8 py-3 rounded-full text-xs font-bold uppercase">Retour a la boutique</a>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkout.isFormValid()) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    checkout.setSubmitting(true);
    // Simulation d'envoi
    setTimeout(() => {
      alert("Commande enregistrée ! Nous vous contacterons rapidement.");
      checkout.setSubmitting(false);
    }, 1500);
  };

  const handleBackToCart = () => {
    router.push("/");
    openCart();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] font-sans text-[#2C2224]">
      <header className="bg-white border-b border-[#E88D9E]/15 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <button
          type="button"
          onClick={handleBackToCart}
          className="text-xs font-mono font-bold text-gray-500 hover:text-[#E88D9E] uppercase tracking-wider"
        >
          Retour au panier
        </button>
        <div className="text-center">
          <h1 className="text-lg font-serif font-bold tracking-[0.2em] uppercase">ANZY COLLECTION</h1>
          <span className="text-[7px] font-mono tracking-[0.25em] text-[#E88D9E] uppercase">Paiement Securise</span>
        </div>
        <div className="w-20" />
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <CustomerInfo
              formData={checkout.formData}
              handleInputChange={checkout.handleInputChange}
              isOther={checkout.isOther}
              countryName={checkout.countryName}
              customCountryName={checkout.customCountryName}
              setCustomCountryName={checkout.setCustomCountryName}
              localShippingOptions={checkout.localShippingOptions}
              localSelectedShipping={checkout.localSelectedShipping}
              setLocalSelectedShipping={checkout.setLocalSelectedShipping}
              effectiveShipping={checkout.effectiveShipping}
              selectedShipping={checkout.selectedShipping}
            />
            <PaymentSection
              paymentMethod={checkout.paymentMethod}
              setPaymentMethod={checkout.setPaymentMethod}
              transferService={checkout.transferService}
              setTransferService={checkout.setTransferService}
              mtcnCode={checkout.mtcnCode}
              setMtcnCode={checkout.setMtcnCode}
              mtcnError={checkout.mtcnError}
              receiptFile={checkout.receiptFile}
              receiptPreview={checkout.receiptPreview}
              handleFileChange={checkout.handleFileChange}
              setReceiptFile={checkout.setReceiptFile}
              setReceiptPreview={checkout.setReceiptPreview}
            />
          </div>

          <div className="lg:col-span-5">
            <OrderSummary
              items={checkout.items}
              subtotal={checkout.subtotal}
              shippingCost={checkout.shippingCost}
              total={checkout.total}
              isFormValid={checkout.isFormValid}
              submitting={checkout.submitting}
              convertirPrix={checkout.convertirPrix}
              symboleDevise={checkout.symboleDevise}
              onSubmit={handleSubmit}
            />
          </div>
        </form>
      </main>
    </div>
  );
}