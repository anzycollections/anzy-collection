"use client";

import { useState, useRef } from "react";
import useCart from "@/context/CartContext";
import { useStore, Product, VarianteCombi } from "@/context/StoreContext";
import ProductDrawer from "@/components/ui/ProductDrawer";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function CartItemRow({ item, onUpdateQty, onRemove, onEditProduct, convertirPrix, symboleDevise }: any) {
  const [startX, setStartX] = useState<number | null>(null);
  const [translateX, setTranslateX] = useState<number>(0);
  const isSwiping = useRef(false);

  const id = item.productId || item.id;
  const title = item.productName || item.name || "Article";
  const variante = item.varianteName && item.varianteName !== "Standard" ? item.varianteName : null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    isSwiping.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startX || !isSwiping.current) return;
    const diff = e.touches[0].clientX - startX;
    if (diff < 0) setTranslateX(Math.max(diff, -80));
    else setTranslateX(0);
  };

  const handleTouchEnd = () => {
    isSwiping.current = false;
    setTranslateX(translateX < -40 ? -80 : 0);
    setStartX(null);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-3 select-none bg-red-600">
      <div 
        className="absolute inset-y-0 right-0 w-20 bg-red-600 text-white flex items-center justify-center font-mono font-bold text-[10px] uppercase tracking-wider cursor-pointer"
        onClick={() => onRemove(id, item.varianteId)}
      >
        <span>Supprimer</span>
      </div>

      <div
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex gap-3.5 p-3.5 bg-white border border-gray-100 shadow-sm items-center transition-transform duration-200 ease-out rounded-2xl relative z-10"
      >
        <div 
          onClick={() => onEditProduct(item)} 
          className="cursor-pointer group shrink-0"
        >
          <img
            src={item.image}
            alt={title}
            className="w-14 h-14 object-cover rounded-xl border border-gray-100 group-hover:opacity-80 transition"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 
            onClick={() => onEditProduct(item)}
            className="text-xs font-bold font-serif text-[#2C2224] truncate cursor-pointer hover:text-[#E88D9E] transition"
          >
            {title}
          </h4>

          {variante && (
            <span 
              onClick={() => onEditProduct(item)}
              className="inline-block text-[9px] font-mono text-[#E88D9E] bg-[#E88D9E]/10 px-2 py-0.5 rounded-md mt-0.5 font-semibold cursor-pointer"
            >
              {variante}
            </span>
          )}

          <p className="text-[11px] text-[#2C2224] font-mono font-bold mt-0.5">
            {convertirPrix(item.price).toLocaleString()} {symboleDevise}
          </p>

          <div className="flex items-center gap-2 mt-1.5">
            <button
              type="button"
              onClick={() => onUpdateQty(id, item.quantity - 1, item.varianteId)}
              className="w-5 h-5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold flex items-center justify-center cursor-pointer text-gray-600"
            >
              -
            </button>
            <span className="text-xs font-mono font-bold text-[#2C2224]">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onUpdateQty(id, item.quantity + 1, item.varianteId)}
              className="w-5 h-5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold flex items-center justify-center cursor-pointer text-gray-600"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(id, item.varianteId)}
          className="text-gray-300 hover:text-red-500 p-1.5 transition cursor-pointer shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { products, convertirPrix, symboleDevise } = useStore();

  const [editingItem, setEditingItem] = useState<any>(null);

  if (!isOpen) return null;

  const handleEditProduct = (item: any) => {
    const targetId = item.productId || item.id;
    let fullProduct = (products || []).find((p: any) => p.id === targetId);

    if (!fullProduct) {
      // Objet conforme à l'interface Product & VarianteCombi
      fullProduct = {
        id: targetId,
        brand: "ANZY COLLECTION",
        name: item.productName || item.name || "Article",
        category: "Gaines",
        badge: "",
        description: "",
        price: item.price,
        currency: "XOF",
        material: "",
        sizes: [],
        colors: [],
        images: [item.image],
        stock: 10,
        visible: true,
        options: [],
        variantes: [
          {
            id: item.varianteId || "default",
            combo: { Option: item.varianteName || "Standard" },
            price: item.price,
            stock: 10,
            image: item.image,
            active: true,
          } as VarianteCombi,
        ],
      };
    }

    setEditingItem({
      product: fullProduct,
      varianteId: item.varianteId,
      quantity: item.quantity,
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    let message = "Bonjour Anzy Collection,\nJe souhaite passer commande :\n\n";
    cart.forEach((item: any) => {
      const variante = item.varianteName && item.varianteName !== "Standard" ? ` [${item.varianteName}]` : "";
      message += `• *${item.productName || item.name}*${variante}\n  Qté: ${item.quantity} — ${convertirPrix(item.price * item.quantity).toLocaleString()} ${symboleDevise}\n`;
    });
    message += `\n*TOTAL : ${convertirPrix(totalPrice).toLocaleString()} ${symboleDevise}*`;
    window.open(`https://wa.me/22900000000?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <div className="w-screen max-w-md bg-[#FAF7F5] shadow-2xl flex flex-col justify-between text-[#2C2224] border-l border-white/60">
            
            <div className="px-6 py-5 flex items-center justify-between border-b border-[#E88D9E]/15 bg-white/60 backdrop-blur-md sticky top-0 z-10">
              <div>
                <span className="text-[9px] font-mono tracking-[0.25em] text-[#E88D9E] uppercase font-bold block">
                  VOTRE SÉLECTION
                </span>
                <h2 className="text-xl font-serif font-bold text-[#2C2224]">Mon Panier</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#2C2224] transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-mono text-xs uppercase tracking-widest">
                  Votre panier est vide
                </div>
              ) : (
                <div>
                  <span className="text-[8.5px] font-mono text-gray-400 uppercase block mb-3 text-right">
                    💡 Cliquez sur un produit pour le modifier
                  </span>
                  {cart.map((item: any, idx: number) => (
                    <CartItemRow
                      key={`${item.productId || item.id}-${item.varianteId}-${idx}`}
                      item={item}
                      onUpdateQty={updateQuantity}
                      onRemove={removeFromCart}
                      onEditProduct={handleEditProduct}
                      convertirPrix={convertirPrix}
                      symboleDevise={symboleDevise}
                    />
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white/90 backdrop-blur-xl border-t border-[#E88D9E]/15 sticky bottom-0 z-10 space-y-4 shadow-lg pb-10">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">TOTAL ESTIMÉ</span>
                  <span className="text-sm sm:text-base font-mono font-bold text-[#2C2224]">
                    {convertirPrix(totalPrice).toLocaleString()} {symboleDevise}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-2xl bg-[#2C2224] hover:bg-[#E88D9E] text-white text-xs font-mono font-bold uppercase tracking-[0.2em] shadow-xl transition-all duration-300 flex items-center justify-between px-6 cursor-pointer group"
                >
                  <span>COMMANDER</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>

                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full text-center text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-red-600 font-semibold transition cursor-pointer"
                >
                  Vider le panier
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {editingItem && (
        <ProductDrawer
          product={editingItem.product}
          initialVarianteId={editingItem.varianteId}
          initialQuantity={editingItem.quantity}
          onClose={() => setEditingItem(null)}
        />
      )}
    </>
  );
}