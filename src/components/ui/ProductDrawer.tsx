"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Défilement des images par balayage tactile (swipe)
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) < 40) return; // balayage trop court, on ignore
    if (deltaX < 0) {
      setActiveImageIndex((prev) => (prev + 1) % allImages.length);
    } else {
      setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

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
    <div className="fixed inset-0 z-50 bg-[#FAF7F5] overflow-y-auto">

      {/* IMAGE PLEIN ÉCRAN */}
      <div
        className="relative w-full h-[58vh] sm:h-[64vh] bg-gray-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {allImages.length > 0 ? (
          <>
            <Image
              src={allImages[activeImageIndex]}
              alt={`${product.name} - Vue ${activeImageIndex + 1}`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              aria-label="Agrandir l'image"
              className="absolute bottom-5 right-5 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center text-[#2C2224] hover:bg-white transition cursor-zoom-in active:scale-95 z-10"
            >
              ⤢
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 space-y-2">
            <span className="text-5xl">📷</span>
            <span className="text-[10px] font-mono uppercase tracking-wider">Image à venir</span>
          </div>
        )}

        {/* Boutons flottants */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-5 pt-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Retour"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#2C2224] hover:bg-white transition cursor-pointer active:scale-95"
          >
            ←
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#2C2224] hover:bg-white transition cursor-pointer active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Pastilles de pagination si plusieurs images */}
        {allImages.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`Voir l'image ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* PANNEAU D'INFOS — remonte par-dessus l'image */}
      <div className="relative -mt-7 bg-[#FAF7F5] rounded-t-[2rem] min-h-[45vh] px-6 pt-6 pb-32 space-y-6 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">

        {/* Miniatures (uniquement si plusieurs images, complément discret des pastilles) */}
        {allImages.length > 1 && (
          <div className="flex gap-2 justify-center -mt-1">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-12 h-12 rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer shrink-0
                  ${idx === activeImageIndex
                    ? "border-[#2C2224] shadow-md ring-1 ring-[#2C2224]"
                    : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                  }`}
              >
                <Image src={img} alt={`${product.name} - Miniature ${idx + 1}`} fill sizes="48px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="space-y-1.5 text-center sm:text-left">
          <span className="text-[8px] font-mono tracking-[0.25em] text-[#E88D9E] uppercase font-semibold block">
            {product.brand || "ANZY COLLECTION"}
          </span>
          <div className="flex items-center justify-center sm:justify-between gap-3 flex-wrap">
            <h2 className="text-xl font-serif font-normal text-[#2C2224] leading-snug tracking-wide">{product.name}</h2>
            <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-100 text-[10px] font-mono shadow-xs">
              <span className="text-amber-400">★</span><span className="font-semibold text-[#2C2224]">5.0</span><span className="text-gray-400">({reviews.length})</span>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
            <span className="text-lg font-mono font-bold text-[#2C2224]">{convertirPrix(currentPrice).toLocaleString()} {symboleDevise}</span>
          </div>
          <div className="flex justify-center sm:justify-start pt-1">
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

        {/* Sélecteur de variantes (swatches couleur si reconnues) */}
        {variantes.length > 0 && (
          <VariantSelector
            variantes={variantes}
            selectedVariante={selectedVariante}
            onSelectVariante={setSelectedVariante}
            currency={symboleDevise}
            productOptions={product.options}
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

        {/* REVIEWS */}
        <div className="pt-4 border-t border-[#E88D9E]/15 space-y-3">
           <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono tracking-[0.15em] text-gray-400 uppercase font-medium">AVIS ({reviews.length})</span>
            <button type="button" onClick={() => setShowReviewForm(!showReviewForm)} className="text-[9px] font-mono text-[#E88D9E] uppercase font-semibold hover:underline cursor-pointer">
              {showReviewForm ? "Fermer" : "+ Donnez votre avis"}
            </button>
          </div>

          {successMessage && (
            <p className="text-[10px] font-mono text-green-600 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
              {successMessage}
            </p>
          )}

          {showReviewForm && (
            <form onSubmit={handleAddReview} className="space-y-2.5 p-3.5 rounded-xl border border-gray-100 bg-white">
              <div>
                <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Votre note</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`text-lg leading-none cursor-pointer transition ${star <= newRating ? "text-amber-400" : "text-gray-200"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Votre prénom</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  required
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E88D9E] outline-none"
                  placeholder="Ex : Fatima"
                />
              </div>
              <div>
                <label className="text-[9px] font-mono uppercase tracking-wider text-gray-400 block mb-1">Votre avis</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  rows={3}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E88D9E] outline-none resize-none"
                  placeholder="Qu'avez-vous pensé de ce produit ?"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-[#2C2224] hover:bg-[#E88D9E] text-white text-[10px] font-mono uppercase tracking-widest transition disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Envoi..." : "Envoyer mon avis"}
              </button>
            </form>
          )}

          <div className="space-y-2.5">
            {loadingReviews ? (
              <p className="text-[10px] font-mono text-gray-400 italic">Chargement des avis...</p>
            ) : reviews.length === 0 ? (
              <p className="text-[10px] font-mono text-gray-400 italic">Aucun avis pour ce produit pour le moment.</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="p-3 rounded-xl border border-gray-100 bg-white space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-[#2C2224]">{r.author}</span>
                    <span className="text-amber-400 text-xs">{"★".repeat(r.rating)}<span className="text-gray-200">{"★".repeat(5 - r.rating)}</span></span>
                  </div>
                  <p className="text-[11px] font-mono text-gray-500 leading-relaxed">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CTA fixé en bas de l'écran */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-xl border-t border-[#E88D9E]/15 z-20 shadow-lg">
        <button type="button" onClick={handleAddToCart} disabled={currentStock === 0} className="w-full py-3.5 rounded-xl bg-[#2C2224] hover:bg-[#E88D9E] text-white text-[11px] font-mono font-medium uppercase tracking-[0.2em] shadow-md transition-all duration-300 flex items-center justify-between px-5 cursor-pointer active:scale-98 group disabled:opacity-50 disabled:cursor-not-allowed">
          <span>{currentStock === 0 ? "ÉPUISÉ" : (initialVarianteId ? "METTRE À JOUR" : "AJOUTER AU PANIER")}</span>
          <span className="font-mono text-[11px] text-[#E88D9E] group-hover:text-white transition-colors">{priceFormatted} {symboleDevise}</span>
        </button>
      </div>

      {/* VISIONNEUSE PLEIN ÉCRAN — image entière visible, non recadrée */}
      {isLightboxOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Fermer"
            className="absolute top-6 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition cursor-pointer z-10"
          >
            ✕
          </button>
          <div className="relative w-full h-full max-w-3xl mx-auto" onClick={(e) => e.stopPropagation()}>
            <Image
              src={allImages[activeImageIndex]}
              alt={`${product.name} - Vue ${activeImageIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          {allImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                  aria-label={`Voir l'image ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}