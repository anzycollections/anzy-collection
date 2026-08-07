"use client";

import { useEffect } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import CustomerInfo from "@/components/checkout/CustomerInfo";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useCartUI } from "@/context/CartUIContext";

export default function CheckoutPage() {
  const { closeCart } = useCartUI();
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
    setTimeout(() => {
      alert("Commande enregistrée ! Nous vous contacterons rapidement.");
      checkout.setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] font-sans text-[#2C2224] py-12 px-4 sm:px-8">
      <main className="max-w-6xl mx-auto">
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