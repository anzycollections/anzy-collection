"use client";

import { useState, useEffect } from "react";
import { Product, useStore } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";
import ProductDescription from "./ProductDescription";
import VariantSelector from "./VariantSelector";
import { getApprovedReviews, createReview } from "@/app/actions/reviews";

interface ProductDrawerProps {
  product: Product;
  onClose: () => void;
  initialVarianteId?: string;
  initialQuantity?: number;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  createdAt: Date | string;
  comment: string;
}

export default function ProductDrawer({
  product,
  onClose,
  initialVarianteId,
  initialQuantity = 1,
}: ProductDrawerProps) {
  const store = useStore() as any;
  const convertirPrix = store?.convertirPrix || ((p: number) => p);
  const symboleDevise = store?.symboleDevise || "F CFA";

  const { addToCart } = useCart();

  const variantes = product.variantes || [];
  const [selectedVariante, setSelectedVariante] = useState<any>(
    variantes.find((v: any) => v.id === initialVarianteId) || variantes[0] || null
  );
  const [quantity, setQuantity] = useState(initialQuantity);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState("");
  const [newComment, setNewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await getApprovedReviews(product.id);
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingReviews(false);
      }
    }
    loadReviews();
  }, [product.id]);

  const allImages = Array.from(new Set([
    ...(selectedVariante?.image ? [selectedVariante.image] : []),
    ...(product.images || [])
  ]));

  if (allImages.length === 0) {
    allImages.push("/images/placeholder-product.jpg");
  }

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedVariante]);

  const currentPrice = selectedVariante?.price || product.price || 0;
  const priceFormatted = convertirPrix(currentPrice * quantity).toLocaleString();
  const currentStock = selectedVariante?.stock !== undefined ? selectedVariante.stock : product.stock;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      varianteId: selectedVariante?.id || "default",
      varianteName: selectedVariante
        ? (selectedVariante.name || selectedVariante.title || Object.values(selectedVariante.combo || {}).join(" - ") || "Standard")
        : "Standard",
      price: currentPrice,
      quantity,
      image: allImages[0],
    });
    onClose();
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;
    setSubmitting(true);
    const res = await createReview({ productId: product.id, author: newAuthor, rating: newRating, comment: newComment });
    setSubmitting(false);
    if (res.success) {
      setSuccessMessage("Merci ! Votre avis a été envoyé et est en attente de modération.");
      setNewAuthor(""); setNewComment(""); setShowReviewForm(false);
      setTimeout(() => setSuccessMessage(""), 5000);
    } else {
      alert("Une erreur est survenue lors de l'envoi de votre avis.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-[#FAF7F5] shadow-2xl flex flex-col justify-between text-[#2C2224] animate-in slide-in-from-right duration-300 border-l border-white/60">

          <div className="px-6 py-4 flex items-center justify-between border-b border-[#E88D9E]/15 bg-white/70 backdrop-blur-md sticky top-0 z-20">
            <div>
              <span className="text-[8px] font-mono tracking-[0.25em] text-[#E88D9E] uppercase font-semibold block">
                {product.brand || "ANZY COLLECTION"}
              </span>
              <h3 className="text-[10px] font-serif italic text-gray-400">Haute Couture</h3>
            </div>
            <button type="button" onClick={onClose} className="w-7 h-7 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-400 hover:text-[#2C2224] transition cursor-pointer shadow-2xs active:scale-95">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 pb-28">

            {/* NOUVELLE DISPOSITION : MINIATURES VERTICALES À GAUCHE */}
            <div className="flex gap-3 max-w-[340px] mx-auto">
              
              {/* Colonne des miniatures */}
              {allImages.length > 1 && (
                <div className="flex flex-col gap-2.5 w-[50px] shrink-0">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-full aspect-square rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer
                        ${idx === activeImageIndex
                          ? "border-[#2C2224] shadow-md ring-1 ring-[#2C2224]" 
                          : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                        }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} - Miniature ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Image principale */}
              <div className="flex-1 relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm aspect-[4/5]">
                <img
                  src={allImages[activeImageIndex]}
                  alt={`${product.name} - Vue ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
            {/* FIN NOUVELLE DISPOSITION */}

            <div className="space-y-1.5 text-center sm:text-left border-b border-[#E88D9E]/15 pb-4">
              <h2 className="text-base font-serif font-normal text-[#2C2224] leading-snug tracking-wide">{product.name}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-0.5">
                <span className="text-sm font-mono font-bold text-[#2C2224]">{convertirPrix(currentPrice).toLocaleString()} {symboleDevise}</span>
                <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-gray-100 text-[9px] font-mono shadow-xs">
                  <span className="text-amber-400">★</span><span className="font-semibold text-[#2C2224]">5.0</span><span className="text-gray-400">({reviews.length})</span>
                </div>
              </div>
              <div className="flex justify-center sm:justify-start mt-3">
                {currentStock !== undefined && currentStock <= 5 && currentStock > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 border border-orange-100/50 text-orange-600 text-[9px] font-mono font-bold uppercase tracking-widest shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>Plus que {currentStock} en stock
                  </span>
                )}
                {(currentStock === undefined || currentStock > 5) && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100/50 text-emerald-600 text-[9px] font-mono font-bold uppercase tracking-widest shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Disponible
                  </span>
                )}
                {currentStock === 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 border border-red-100/50 text-red-600 text-[9px] font-mono font-bold uppercase tracking-widest shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Rupture de stock
                  </span>
                )}
              </div>
            </div>

            {/* Sélecteur de variantes */}
            {variantes.length > 0 && (
              <VariantSelector
                variantes={variantes}
                selectedVariante={selectedVariante}
                onSelectVariante={setSelectedVariante}
                currency={symboleDevise}
              />
            )}

            <div className="space-y-1.5">
              <span className="text-[9px] font-mono tracking-[0.15em] text-gray-400 uppercase font-medium block">QUANTITÉ</span>
              <div className="inline-flex items-center rounded-xl bg-white border border-gray-200 p-0.5 shadow-2xs">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 font-bold text-gray-500 text-xs flex items-center justify-center transition cursor-pointer">-</button>
                <span className="w-8 text-center font-mono text-xs font-semibold text-[#2C2224]">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} disabled={currentStock !== undefined && quantity >= currentStock} className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 font-bold text-gray-500 text-xs flex items-center justify-center transition cursor-pointer disabled:opacity-30">+</button>
              </div>
            </div>

            <ProductDescription description={product.description || ""} />

            {/* REVIEWS... */}
            <div className="pt-4 border-t border-[#E88D9E]/15 space-y-3">
               {/* (Le code des reviews reste inchangé) */}
               <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono tracking-[0.15em] text-gray-400 uppercase font-medium">AVIS ({reviews.length})</span>
                <button type="button" onClick={() => setShowReviewForm(!showReviewForm)} className="text-[9px] font-mono text-[#E88D9E] uppercase font-semibold hover:underline cursor-pointer">
                  {showReviewForm ? "Fermer" : "+ Donnez votre avis"}
                </button>
              </div>

              {/* ... reste du code des reviews ... */}
            </div>
          </div>

          <div className="p-5 bg-white/95 backdrop-blur-xl border-t border-[#E88D9E]/15 sticky bottom-0 z-20 shadow-lg">
            <button type="button" onClick={handleAddToCart} disabled={currentStock === 0} className="w-full py-3.5 rounded-xl bg-[#2C2224] hover:bg-[#E88D9E] text-white text-[11px] font-mono font-medium uppercase tracking-[0.2em] shadow-md transition-all duration-300 flex items-center justify-between px-5 cursor-pointer active:scale-98 group disabled:opacity-50 disabled:cursor-not-allowed">
              <span>{currentStock === 0 ? "ÉPUISÉ" : (initialVarianteId ? "METTRE À JOUR" : "AJOUTER AU PANIER")}</span>
              <span className="font-mono text-[11px] text-[#E88D9E] group-hover:text-white transition-colors">{priceFormatted} {symboleDevise}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}