"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import ProductDrawer from "@/components/ui/ProductDrawer";
import CartItemRow from "../cart/CartItemRow";
import ShippingSelector from "../cart/ShippingSelector";
import CartFooter from "../cart/CartFooter";
import { useRouter } from "next/navigation";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeFromCart, updateQuantity, country, selectedShipping, subtotal, total } = useCart();
  const { products, convertirPrix, symboleDevise } = useStore();
  const [editingItem, setEditingItem] = useState<any>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleEditProduct = (item: any) => {
    const targetId = item.productId || item.id;
    const fullProduct = (products || []).find((p: any) => p.id === targetId) || {
        id: targetId, brand: "ANZY COLLECTION", name: item.productName || "Article",
        price: item.price, images: [item.image], variantes: [{ id: item.varianteId, combo: { Option: item.varianteName }, price: item.price, image: item.image }]
    };
    setEditingItem({ product: fullProduct, varianteId: item.varianteId, quantity: item.quantity });
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    onClose();
    router.push("/checkout");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />
        <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FAF7F5] shadow-2xl flex flex-col justify-between text-[#2C2224] border-l border-white/60">
          <div className="px-6 py-5 flex items-center justify-between border-b border-[#E88D9E]/15 bg-white/60 backdrop-blur-md sticky top-0 z-10">
            <div><span className="text-[9px] font-mono tracking-[0.25em] text-[#E88D9E] uppercase font-bold">VOTRE SÉLECTION</span><h2 className="text-xl font-serif font-bold">Mon Panier</h2></div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center cursor-pointer">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? <p className="text-center py-20 text-gray-400 font-mono text-xs uppercase tracking-widest">Panier vide</p> : (
              <>
                {items.map((item, i) => <CartItemRow key={i} item={item} onUpdateQty={updateQuantity} onRemove={removeFromCart} onEditProduct={handleEditProduct} convertirPrix={convertirPrix} symboleDevise={symboleDevise} />)}
                <ShippingSelector />
              </>
            )}
          </div>
          {items.length > 0 && <CartFooter onCheckout={handleCheckout} />}
        </div>
      </div>
      {editingItem && <ProductDrawer product={editingItem.product} initialVarianteId={editingItem.varianteId} initialQuantity={editingItem.quantity} onClose={() => setEditingItem(null)} />}
    </>
  );
}
