"use client";

interface OrderSummaryProps {
  items: any[];
  subtotal: number;
  shippingCost: number;
  total: number;
  isFormValid: () => boolean;
  submitting: boolean;
  convertirPrix: (p: number) => number;
  symboleDevise: string;
  onSubmit: (e: React.FormEvent) => void;
}

export default function OrderSummary({
  items, subtotal, shippingCost, total, isFormValid, submitting,
  convertirPrix, symboleDevise, onSubmit,
}: OrderSummaryProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg shadow-[#E88D9E]/5 border border-[#E88D9E]/20 sticky top-24">
      <h2 className="font-serif font-bold text-lg mb-6">Resume de la commande</h2>
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
          <span>Sous-total</span>
          <span className="font-mono">{convertirPrix(subtotal)} {symboleDevise}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Livraison</span>
          <span className="font-mono">{convertirPrix(shippingCost)} {symboleDevise}</span>
        </div>
      </div>

      <div className="border-t border-[#E88D9E]/30 mt-4 pt-4 flex justify-between items-center">
        <span className="font-bold text-base uppercase tracking-wider">Total</span>
        <span className="text-xl font-mono font-bold text-[#E88D9E]">{convertirPrix(total)} {symboleDevise}</span>
      </div>

      <button
        type="submit"
        disabled={!isFormValid() || submitting}
        className={`w-full mt-8 py-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-widest shadow-xl transition-all ${
          isFormValid() ? "bg-[#2C2224] text-white hover:bg-[#E88D9E] cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {submitting ? "Validation en cours..." : "Confirmer et payer"}
      </button>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">Besoin d'aide ?</p>
        <a
          href="https://wa.me/2290156646045"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E88D9E] text-xs font-bold underline mt-1 inline-block"
        >
          Contactez-nous via WhatsApp
        </a>
      </div>
    </div>
  );
}
