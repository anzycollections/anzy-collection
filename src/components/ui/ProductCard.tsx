import { Product, useStore } from "@/context/StoreContext";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  favorites: { [key: string]: boolean };
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export default function ProductCard({ product, onSelect, favorites, onToggleFavorite }: ProductCardProps) {
  const { convertirPrix, symboleDevise, t } = useStore();

  // Prix le plus bas parmi les variantes actives
  const prixMin = product.variantes && product.variantes.length > 0
    ? Math.min(...product.variantes.filter(v => v.active).map(v => v.price))
    : product.price;

  const prixAffiche = convertirPrix(prixMin);
  const hasVariantes = product.variantes && product.variantes.length > 0;

  const getStockLabel = () => {
    const stockTotal = hasVariantes
      ? product.variantes.filter(v => v.active).reduce((sum, v) => sum + v.stock, 0)
      : product.stock;
    if (stockTotal <= 0) return { text: t("outOfStock"), color: "text-red-400 bg-red-50" };
    if (stockTotal <= 7) return { text: `${stockTotal} ${t("stockLeft")}`, color: "text-orange-500 bg-orange-50" };
    return { text: t("available"), color: "text-green-600 bg-green-50" };
  };

  const stockInfo = getStockLabel();

  const formatPrix = () => {
    const affiche = `${prixAffiche.toLocaleString()} ${symboleDevise === "F CFA" ? "F CFA" : symboleDevise}`;
    return hasVariantes ? `À partir de ${affiche}` : affiche;
  };

  // Image : image principale du produit > première image variante > placeholder
  const mainImage = product.images?.[0] || product.variantes?.find(v => v.active && v.image)?.image || "";

  return (
    <div onClick={() => onSelect(product)}
      className="group bg-white rounded-3xl p-5 border border-[#E88D9E]/15 hover:border-[#E88D9E]/50 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative">
      
      <button onClick={(e) => onToggleFavorite(product.id, e)}
        className="absolute top-7 right-7 z-10 w-9 h-9 rounded-full bg-white/90 border border-[#E88D9E]/20 flex items-center justify-center text-sm shadow-sm hover:scale-110 transition">
        <span className={favorites[product.id] ? "text-[#E88D9E]" : "text-gray-400"}>{favorites[product.id] ? "♥" : "♡"}</span>
      </button>

      <div className="absolute top-7 left-7 z-10">
        <span className="bg-[#FAF7F5] text-[#2C2224] text-[9px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-[#E88D9E]/20 font-semibold">{product.badge}</span>
      </div>

      <div className="h-72 w-full flex items-center justify-center my-4 overflow-hidden rounded-2xl bg-[#FAF7F5]">
        {mainImage ? (
          <img src={mainImage} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition duration-500 ease-out" />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300 space-y-2">
            <span className="text-4xl">📷</span>
            <span className="text-[10px] font-mono uppercase tracking-wider">Image à venir</span>
          </div>
        )}
      </div>

      <div className="space-y-2 pt-2">
        <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase block font-semibold">{product.brand}</span>

        <div className="flex justify-between items-start">
          <h3 className="text-base font-serif font-semibold text-[#2C2224] group-hover:text-[#E88D9E] transition">{product.name}</h3>
          <span className="text-sm font-bold text-[#2C2224] ml-2 whitespace-nowrap">{formatPrix()}</span>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 font-light">{product.description}</p>

        <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block ${stockInfo.color}`}>
          {stockInfo.text}
        </div>

        {product.options && product.options.length > 0 && (
          <div className="pt-1 flex flex-wrap gap-1">
            {product.options.map((opt, idx) => (
              <span key={idx} className="text-[9px] bg-[#FAF7F5] text-[#2C2224] px-2 py-0.5 rounded-full border border-[#E88D9E]/20 font-mono">
                {opt.name}: {opt.values.join(", ")}
              </span>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-[#E88D9E]/10 flex items-center justify-between">
          <div className="flex space-x-1.5 items-center">
            {product.colors?.map((c, idx) => (
              <span key={idx} style={{ backgroundColor: c.hex }} className="w-3.5 h-3.5 rounded-full border border-black/20" />
            ))}
          </div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#E88D9E] group-hover:translate-x-1 transition flex items-center">
            {t("viewPiece")}
          </span>
        </div>
      </div>
    </div>
  );
}
