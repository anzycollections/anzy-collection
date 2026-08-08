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

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  if (checkout.items.length === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-2xl font-serif font-bold text-[#2C2224]">Votre panier est vide</h1>
          <p className="text-gray-500 text-xs font-mono">Ajoutez des pièces pour continuer.</p>
          <a href="/" className="inline-block bg-[#2C2224] text-white px-8 py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest hover:bg-black transition">Retour à la boutique</a>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkout.isFormValid()) {
      alert("Veuillez remplir tous les champs obligatoires et fournir le justificatif.");
      return;
    }
    checkout.setSubmitting(true);

    const WHATSAPP_NUMBER = "2290156646045";

    const itemsText = checkout.items
      .map(item => `• ${item.productName} (${item.varianteName || 'Standard'}) x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} F CFA`)
      .join("\n");

    const paymentText = checkout.paymentMethod === "mobile_money"
      ? "Paiement : Mobile Money (Reçu fourni)"
      : `Transfert : ${checkout.transferService} (MTCN: ${checkout.mtcnCode})`;

    const message = `
NOUVELLE COMMANDE - ANZY COLLECTION

CLIENTE :
• Nom : ${checkout.formData.name}
• Téléphone : ${checkout.formData.phone}
• Adresse : ${checkout.formData.address}, ${checkout.formData.city} (${checkout.countryName})
${checkout.formData.email ? `• Email : ${checkout.formData.email}` : ""}

ARTICLES :
${itemsText}

LIVRAISON :
• ${checkout.effectiveShipping?.name || "Standard"} : ${checkout.shippingCost.toLocaleString()} F CFA

TOTAL : ${checkout.total.toLocaleString()} F CFA

${paymentText}

Statut : En attente de validation (24h)
    `.trim();

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      checkout.setSubmitting(false);
      window.open(whatsappUrl, "_blank");
      setShowSuccessModal(true);
    }, 400);
  };

  const handleBackToCart = () => {
    router.push("/");
    openCart();
  };

  // Normalisation des items pour garantir un ID de type string
  const formattedItems = checkout.items.map(item => ({
    ...item,
    id: item.id || Math.random().toString(),
  }));

  return (
    <div className="min-h-screen bg-[#FAF7F5] font-sans text-[#2C2224] py-10 px-4 sm:px-8 relative">
      
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/");
        }}
      />

      <main className="max-w-6xl mx-auto space-y-6">
        <div>
          <button
            type="button"
            onClick={handleBackToCart}
            className="text-[11px] font-mono text-gray-400 hover:text-[#2C2224] transition tracking-wider flex items-center gap-1.5 cursor-pointer"
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
              items={formattedItems}
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