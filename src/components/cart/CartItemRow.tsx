import { useState, useRef } from "react";

export default function CartItemRow({ item, onUpdateQty, onRemove, onEditProduct, convertirPrix, symboleDevise }: any) {
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
        <div onClick={() => onEditProduct(item)} className="cursor-pointer group shrink-0">
          <img src={item.image} alt={title} className="w-14 h-14 object-cover rounded-xl border border-gray-100 group-hover:opacity-80 transition" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 onClick={() => onEditProduct(item)} className="text-xs font-bold font-serif text-[#2C2224] truncate cursor-pointer hover:text-[#E88D9E] transition">{title}</h4>
          {variante && <span onClick={() => onEditProduct(item)} className="inline-block text-[9px] font-mono text-[#E88D9E] bg-[#E88D9E]/10 px-2 py-0.5 rounded-md mt-0.5 font-semibold cursor-pointer">{variante}</span>}
          <p className="text-[11px] text-[#2C2224] font-mono font-bold mt-0.5">{convertirPrix(item.price).toLocaleString()} {symboleDevise}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <button type="button" onClick={() => onUpdateQty(id, item.varianteId, item.quantity - 1)} className="w-5 h-5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold flex items-center justify-center cursor-pointer text-gray-600">-</button>
            <span className="text-xs font-mono font-bold text-[#2C2224]">{item.quantity}</span>
            <button type="button" onClick={() => onUpdateQty(id, item.varianteId, item.quantity + 1)} className="w-5 h-5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold flex items-center justify-center cursor-pointer text-gray-600">+</button>
          </div>
        </div>
      </div>
    </div>
  );
}
