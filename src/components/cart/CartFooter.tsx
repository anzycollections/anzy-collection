import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";

export default function CartFooter({ onCheckout }: { onCheckout: () => void }) {
  const { clearCart, subtotal, shippingCost, total } = useCart();
  const { convertirPrix, symboleDevise } = useStore();

  return (
    <div className="p-6 bg-white/90 backdrop-blur-xl border-t border-[#E88D9E]/15 sticky bottom-0 z-10 space-y-3 shadow-lg pb-8">
      <div className="space-y-1.5 text-xs font-mono">
        <div className="flex justify-between text-gray-500">
          <span>Sous-total articles</span>
          <span>{convertirPrix(subtotal).toLocaleString()} {symboleDevise}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Frais de livraison</span>
          <span>{convertirPrix(shippingCost).toLocaleString()} {symboleDevise}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 font-bold text-[#2C2224] text-sm">
          <span className="tracking-widest uppercase text-[10px] text-gray-400">TOTAL FINAL</span>
          <span className="text-base">{convertirPrix(total).toLocaleString()} {symboleDevise}</span>
        </div>
      </div>

      <button type="button" onClick={onCheckout} className="w-full py-3.5 rounded-2xl bg-[#2C2224] hover:bg-[#E88D9E] text-white text-xs font-mono font-bold uppercase tracking-[0.2em] shadow-xl transition-all duration-300 flex items-center justify-between px-6 cursor-pointer group">
        <span>COMMANDER</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>

      <button type="button" onClick={clearCart} className="w-full text-center text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-red-600 font-semibold transition cursor-pointer">
        Vider le panier
      </button>
    </div>
  );
}
