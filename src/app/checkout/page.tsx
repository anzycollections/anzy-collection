"use client";

import { useState, useEffect } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import CustomerInfo from "@/components/checkout/CustomerInfo";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderSummary from "@/components/checkout/OrderSummary";
import OrderSuccessModal from "@/components/checkout/OrderSuccessModal";
import { useRouter } from "next/navigation";
import { useCartUI } from "@/context/CartUIContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { openCart, closeCart } = useCartUI();
  const checkout = useCheckout();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedOrderData, setCompletedOrderData] = useState<any>(null);

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  if (checkout.items.length === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-2xl font-serif font-bold text-[#2C2224]">Votre panier est vide</h1>
          <p className="text-gray-500 text-xs font-mono">Ajoutez des pièces pour continuer.</p>
          <a href="/" className="inline-block bg-[#2C2224] text-white px-8 py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest hover:bg-[#E88D9E] transition">Retour à la boutique</a>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkout.isFormValid()) {
      alert("Veuillez remplir tous les champs obligatoires et fournir le justificatif.");
      return;
    }
    checkout.setSubmitting(true);
    
    // Sauvegarde des données pour la modale WhatsApp
    const orderData = {
      formData: checkout.formData,
      countryName: checkout.countryName,
      items: checkout.items,
      effectiveShipping: checkout.effectiveShipping,
      shippingCost: checkout.shippingCost,
      subtotal: checkout.subtotal,
      total: checkout.total,
      paymentMethod: checkout.paymentMethod,
      transferService: checkout.transferService,
      mtcnCode: checkout.mtcnCode,
    };

    setTimeout(() => {
      checkout.setSubmitting(false);
      setCompletedOrderData(orderData);
      setShowSuccessModal(true);
    }, 1000);
  };

  const handleBackToCart = () => {
    router.push("/");
    openCart();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] font-sans text-[#2C2224] py-10 px-4 sm:px-8 relative">
      
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/");
        }}
        checkoutData={completedOrderData}
      />

      <main className="max-w-6xl mx-auto space-y-6">
        <div>
          <button
            type="button"
            onClick={handleBackToCart}
            className="text-[11px] font-mono text-gray-400 hover:text-[#E88D9E] transition tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span> Retour à la boutique
          </button>
        </div>

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