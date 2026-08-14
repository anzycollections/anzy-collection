"use client";

import { useStore } from "@/context/StoreContext";

interface OrderSummaryProps {
  items: Array<{
    id: string;
    productName: string;
    varianteName?: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  isFormValid: () => boolean;
  submitting: boolean;
  convertirPrix: (prix: number) => number;
  symboleDevise: string;
  onSubmit: (e: React.FormEvent) => void;
}

export default function OrderSummary({
  items,
  subtotal,
  shippingCost,
  total,
  isFormValid,
  submitting,
  convertirPrix,
  symboleDevise,
  onSubmit,
}: OrderSummaryProps) {
  const { t } = useStore();
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6 sticky top-10">
      
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#2C2224] font-medium">
          {t("checkout.orderSummary")}
        </h3>
      </div>

      {/* Liste des articles */}
      <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex justify-between items-start text-xs">
            <div className="space-y-0.5 pr-2">
              <p className="font-medium text-[#2C2224]">{item.productName}</p>
              {item.varianteName && (
                <p className="text-[10px] text-gray-400 font-mono">{item.varianteName}</p>
              )}
              <p className="text-[10px] text-gray-400">{t("checkout.qty")} : {item.quantity}</p>
            </div>
            <p className="font-mono text-[#2C2224] shrink-0">
              {(convertirPrix(item.price) * item.quantity).toLocaleString()} {symboleDevise}
            </p>
          </div>
        ))}
      </div>

      {/* Totaux */}
      <div className="border-t border-gray-100 pt-4 space-y-2 text-xs font-mono">
        <div className="flex justify-between text-gray-500">
          <span>{t("checkout.subtotal")}</span>
          <span>{convertirPrix(subtotal).toLocaleString()} {symboleDevise}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>{t("checkout.delivery")}</span>
          <span>{shippingCost > 0 ? `${convertirPrix(shippingCost).toLocaleString()} ${symboleDevise}` : t("checkout.toCalculate")}</span>
        </div>
        <div className="flex justify-between text-[#2C2224] font-bold pt-2 border-t border-gray-100 text-sm">
          <span>{t("checkout.total")}</span>
          <span>{convertirPrix(total).toLocaleString()} {symboleDevise}</span>
        </div>
      </div>

      {/* Bouton de soumission */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!isFormValid() || submitting}
        className={`w-full py-4 rounded-xl text-[10px] font-mono uppercase tracking-[0.2em] transition cursor-pointer shadow-md ${
          isFormValid() && !submitting
            ? "bg-[#2C2224] text-white hover:bg-black"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {submitting ? t("checkout.submitting") : t("checkout.submit")}
      </button>

      <p className="text-[10px] text-gray-400 text-center font-light leading-relaxed">
        {t("checkout.disclaimer")}
      </p>
    </div>
  );
}