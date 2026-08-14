"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCheckout } from "@/hooks/useCheckout";
import CustomerInfo from "@/components/checkout/CustomerInfo";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderSummary from "@/components/checkout/OrderSummary";
import OrderSuccessModal from "@/components/checkout/OrderSuccessModal";
import { useRouter } from "next/navigation";
import { useCartUI } from "@/context/CartUIContext";
import { useStore } from "@/context/StoreContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { openCart, closeCart } = useCartUI();
  const checkout = useCheckout();
  const { t } = useStore();

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  if (checkout.items.length === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-2xl font-serif font-bold text-[#2C2224]">{t("checkout.emptyCartTitle")}</h1>
          <p className="text-gray-500 text-xs font-mono">{t("checkout.emptyCartSubtitle")}</p>
          <Link href="/" className="inline-block bg-[#2C2224] text-white px-8 py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest hover:bg-black transition">{t("checkout.backToShop")}</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkout.isFormValid()) {
      alert(t("checkout.missingFields"));
      return;
    }
    checkout.setSubmitting(true);

    const WHATSAPP_NUMBER = "2290156646045";

    // Construction du message SANS attendre l'upload du reçu ou la sauvegarde en base
    // (ces deux opérations se font en arrière-plan, plus bas). On redirige vers
    // WhatsApp en tout premier, de façon synchrone, dans le même clic — c'est la
    // seule façon fiable d'éviter que les navigateurs (Safari en particulier)
    // bloquent l'ouverture en la considérant comme un popup non désiré.
    const itemsText = checkout.items
      .map(item => `• ${item.productName} (${item.varianteName || 'Standard'}) x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} F CFA`)
      .join("\n");

    const paymentText = checkout.paymentMethod === "mobile_money"
      ? "Paiement : Mobile Money — justificatif disponible dans l'onglet Commandes de l'admin (quelques secondes après l'envoi de ce message)"
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

    // Redirection immédiate, synchrone — rien ne la retarde.
    window.open(whatsappUrl, "_blank");
    checkout.setSubmitting(false);
    setShowSuccessModal(true);

    // Sauvegarde en base + upload du reçu, en arrière-plan (n'affecte jamais
    // l'expérience de la cliente ni la redirection WhatsApp ci-dessus).
    (async () => {
      try {
        let receiptUrl = "";
        if (checkout.paymentMethod === "mobile_money" && checkout.receiptFile) {
          const uploadRes = await fetch(
            `/api/upload/receipt?filename=${encodeURIComponent(checkout.receiptFile.name)}`,
            { method: "POST", body: checkout.receiptFile }
          );
          if (uploadRes.ok) {
            const blob = await uploadRes.json();
            receiptUrl = blob.url;
          }
        }

        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: {
              name: checkout.formData.name,
              email: checkout.formData.email,
              phone: checkout.formData.phone,
              address: checkout.formData.address,
              city: checkout.formData.city,
              country: checkout.countryName,
            },
            items: checkout.items,
            shipping: {
              method: checkout.effectiveShipping?.name || "Standard",
              cost: checkout.shippingCost,
            },
            payment: {
              method: checkout.paymentMethod,
              operator: checkout.paymentMethod === "mobile_money" ? "Mobile Money" : checkout.transferService,
              reference: checkout.paymentMethod === "transfer" ? checkout.mtcnCode : "Justificatif joint",
              receiptUrl,
            },
            total: checkout.total,
            currency: "XOF",
          }),
        });
      } catch (err) {
        console.error("Erreur lors de l'enregistrement de la commande en base :", err);
      }
    })();
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
            <span>←</span> {t("checkout.backToShop")}
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