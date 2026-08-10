"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { getShippingOptionsForCountry, SHIPPING_ZONES, ShippingOption } from "@/data/shippingZones";

const mtcnPatterns: Record<string, RegExp> = {
  MoneyGram: /^\d{8}$/,
  "Western Union": /^\d{10}$/,
  Ria: /^\d{13}$/,
};

export function useCheckout() {
  const { items, subtotal, totalPrice, country, selectedShipping, setSelectedShipping, clearCart } = useCart();
  const { convertirPrix, symboleDevise, content } = useStore();

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", city: "", comment: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"mobile_money" | "transfer">("mobile_money");
  const [transferService, setTransferService] = useState("MoneyGram");
  const [mtcnCode, setMtcnCode] = useState("");
  const [mtcnError, setMtcnError] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Pour le cas "Autre"
  const [customCountryName, setCustomCountryName] = useState("");
  const [localShippingOptions, setLocalShippingOptions] = useState<ShippingOption[]>([]);
  const [localSelectedShipping, setLocalSelectedShipping] = useState<ShippingOption | null>(null);

  const isOther = country?.trim().toLowerCase() === "autre";
  const finalCountry = isOther ? customCountryName : country;
  const countryName = isOther ? customCountryName : country;

  useEffect(() => {
    if (isOther && finalCountry) {
      const opts = getShippingOptionsForCountry(finalCountry);
      if (opts.length === 0) {
        setLocalShippingOptions([{
          id: "dhl_international",
          name: "DHL Express International (Assuré)",
          price: 50000,
          insured: true,
          description: "Livraison internationale express et sécurisée",
        }]);
      } else {
        setLocalShippingOptions(opts);
      }
      if (!localSelectedShipping) {
        setLocalSelectedShipping(opts.length > 0 ? opts[0] : {
          id: "dhl_international",
          name: "DHL Express International (Assuré)",
          price: 50000,
          insured: true,
          description: "Livraison internationale express et sécurisée",
        });
      }
    }
  }, [finalCountry, isOther]);

  const effectiveShipping = isOther ? localSelectedShipping : selectedShipping;
  const shippingCost = effectiveShipping?.price || 0;
  // Correction : "totalPrice" (issu du panier) inclut déjà un frais de livraison.
  // On repart de "subtotal" (hors livraison) pour ne compter les frais de port qu'une seule fois.
  const total = subtotal + shippingCost;

  const isFormValid = (): boolean => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim()) return false;
    if (!finalCountry) return false;
    if (isOther && !customCountryName.trim()) return false;
    if (!effectiveShipping) return false;
    if (paymentMethod === "mobile_money") {
      if (!receiptFile) return false;
    } else {
      if (!mtcnCode || mtcnError) return false;
    }
    return true;
  };

  useEffect(() => {
    if (paymentMethod !== "transfer" || !mtcnCode) {
      setMtcnError("");
      return;
    }
    const pattern = mtcnPatterns[transferService];
    if (pattern && !pattern.test(mtcnCode)) {
      setMtcnError(`Format invalide pour ${transferService}.`);
    } else {
      setMtcnError("");
    }
  }, [mtcnCode, transferService, paymentMethod]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setReceiptPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", address: "", city: "", comment: "" });
    setReceiptFile(null);
    setReceiptPreview("");
    setMtcnCode("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setSubmitting(true);
    try {
      const orderData = {
        customer: formData,
        country: countryName,
        shipping: effectiveShipping,
        items,
        payment: {
          method: paymentMethod,
          transferService: paymentMethod === "transfer" ? transferService : null,
          mtcnCode: paymentMethod === "transfer" ? mtcnCode : null,
          receipt: paymentMethod === "mobile_money" ? receiptPreview : null,
        },
        subtotal,
        shippingCost,
        total,
      };

      // Simulation de la requête d'enregistrement de commande
      await new Promise((resolve) => setTimeout(resolve, 800));

      setOrderSuccess(true);
      clearCart();
      resetForm();
    } catch (err) {
      console.error("Erreur lors de la commande :", err);
      alert("Une erreur est survenue lors de la validation de votre commande.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData, setFormData,
    paymentMethod, setPaymentMethod,
    transferService, setTransferService,
    mtcnCode, setMtcnCode,
    mtcnError,
    receiptFile, setReceiptFile,
    receiptPreview, setReceiptPreview,
    submitting, setSubmitting,
    orderSuccess, setOrderSuccess,
    customCountryName, setCustomCountryName,
    localShippingOptions,
    localSelectedShipping, setLocalSelectedShipping,
    isOther, finalCountry, countryName,
    effectiveShipping, shippingCost, total,
    isFormValid,
    handleInputChange,
    handleFileChange,
    resetForm,
    handleSubmit,
    items, subtotal, totalPrice,
    selectedShipping, setSelectedShipping,
    convertirPrix, symboleDevise,
  };
}