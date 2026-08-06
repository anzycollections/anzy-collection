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

  // Vrais états pour les avis
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState("");
  const [newComment, setNewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Charger les avis validés de ce produit au montage
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

  const mainImage = product.images && product.images.length > 0
  ? product.images[0]
  : "/images/placeholder-product.jpg";
  
  const currentPrice = selectedVariante?.price || product.price || 0;
  const priceFormatted = convertirPrix(currentPrice * quantity).toLocaleString();

  const getVarianteLabel = (v: any) => {
    if (!v) return "Standard";
    if (v.combo) return Object.values(v.combo).join(" / ");
    return v.name || v.title || "Option";
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      varianteId: selectedVariante?.id || "default",
      varianteName: getVarianteLabel(selectedVariante),
      price: currentPrice,
      quantity,
      image: mainImage,
    });
    onClose();
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    setSubmitting(true);
    const res = await createReview({
      productId: product.id,
      author: newAuthor,
      rating: newRating,
      comment: newComment,
    });
    setSubmitting(false);

    if (res.success) {
      setSuccessMessage("Merci ! Votre avis a été envoyé et est en attente de modération.");
      setNewAuthor("");
      setNewComment("");
      setShowReviewForm(false);
      setTimeout(() => setSuccessMessage(""), 5000);
    } else {
      alert("Une erreur est survenue lors de l'envoi de votre avis.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-[#FAF7F5] shadow-2xl flex flex-col justify-between text-[#2C2224] animate-in slide-in-from-right duration-300 border-l border-white/60">
          
          <div className="px-6 py-4 flex items-center justify-between border-b border-[#E88D9E]/15 bg-white/70 backdrop-blur-md sticky top-0 z-20">
            <div>
              <span className="text-[8px] font-mono tracking-[0.25em] text-[#E88D9E] uppercase font-semibold block">
                {product.brand || "ANZY COLLECTION"}
              </span>
              <h3 className="text-[10px] font-serif italic text-gray-400">Haute Couture</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-400 hover:text-[#2C2224] transition cursor-pointer shadow-2xs active:scale-95"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 pb-28">
            
            <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-2xs aspect-[4/5] max-w-[280px] mx-auto">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1.5 text-center sm:text-left border-b border-[#E88D9E]/15 pb-4">
              <h2 className="text-base font-serif font-normal text-[#2C2224] leading-snug tracking-wide">
                {product.name}
              </h2>

              <div className="flex items-center justify-center sm:justify-start gap-3 pt-0.5">
                <span className="text-sm font-mono font-bold text-[#2C2224]">
                  {convertirPrix(currentPrice).toLocaleString()} {symboleDevise}
                </span>

                <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-gray-100 text-[9px] font-mono">
                  <span className="text-amber-400">★</span>
                  <span className="font-semibold text-[#2C2224]">5.0</span>
                  <span className="text-gray-400">({reviews.length})</span>
                </div>
              </div>
            </div>

            {variantes.length > 0 && (
              <VariantSelector
                variantes={variantes}
                selectedVariante={selectedVariante}
                onSelectVariante={setSelectedVariante}
              />
            )}

            <div className="space-y-1.5">
              <span className="text-[9px] font-mono tracking-[0.15em] text-gray-400 uppercase font-medium block">
                QUANTITÉ
              </span>
              <div className="inline-flex items-center rounded-xl bg-white border border-gray-200 p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 font-bold text-gray-500 text-xs flex items-center justify-center transition cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center font-mono text-xs font-semibold text-[#2C2224]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 font-bold text-gray-500 text-xs flex items-center justify-center transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <ProductDescription description={product.description || ""} />

            {/* SECTION AVIS CLIENTS DYNAMIQUE */}
            <div className="pt-4 border-t border-[#E88D9E]/15 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono tracking-[0.15em] text-gray-400 uppercase font-medium">
                  AVIS ({reviews.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-[9px] font-mono text-[#E88D9E] uppercase font-semibold hover:underline cursor-pointer"
                >
                  {showReviewForm ? "Fermer" : "+ Donnez votre avis"}
                </button>
              </div>

              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] p-2.5 rounded-xl font-mono">
                  {successMessage}
                </div>
              )}

              {showReviewForm && (
                <form onSubmit={handleAddReview} className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2.5 shadow-2xs">
                  <div>
                    <label className="text-[8px] font-mono text-gray-400 uppercase block mb-0.5">Prénom</label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Marie L."
                      className="w-full text-[11px] bg-gray-50 border border-gray-200 rounded-md p-1.5 focus:outline-none focus:border-[#E88D9E]"
                    />
                  </div>

                  <div>
                    <label className="text-[8px] font-mono text-gray-400 uppercase block mb-0.5">Note</label>
                    <div className="flex gap-1 text-sm cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className={star <= newRating ? "text-amber-400" : "text-gray-200"}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] font-mono text-gray-400 uppercase block mb-0.5">Commentaire</label>
                    <textarea
                      required
                      rows={2}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Votre expérience..."
                      className="w-full text-[11px] bg-gray-50 border border-gray-200 rounded-md p-1.5 focus:outline-none focus:border-[#E88D9E]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2 bg-[#2C2224] text-white text-[9px] font-mono uppercase tracking-widest rounded-lg font-medium hover:bg-[#E88D9E] transition cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Publication..." : "Publier"}
                  </button>
                </form>
              )}

              <div className="space-y-2">
                {loadingReviews ? (
                  <p className="text-[10px] text-gray-400 italic">Chargement des avis...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-[10px] text-gray-400 italic">Soyez le premier à donner votre avis sur cet article.</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="bg-white/80 p-2.5 rounded-xl border border-gray-100/80 space-y-0.5">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="font-semibold text-[#2C2224]">{r.author}</span>
                        <span className="text-gray-300">
                          {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <div className="text-amber-400 text-[10px]">
                        {"★".repeat(r.rating)}
                        <span className="text-gray-200">{"★".repeat(5 - r.rating)}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-sans italic">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          <div className="p-5 bg-white/95 backdrop-blur-xl border-t border-[#E88D9E]/15 sticky bottom-0 z-20 shadow-lg">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-3.5 rounded-xl bg-[#2C2224] hover:bg-[#E88D9E] text-white text-[11px] font-mono font-medium uppercase tracking-[0.2em] shadow-md transition-all duration-300 flex items-center justify-between px-5 cursor-pointer active:scale-98 group"
            >
              <span>{initialVarianteId ? "METTRE À JOUR" : "AJOUTER AU PANIER"}</span>
              <span className="font-mono text-[11px] text-[#E88D9E] group-hover:text-white transition-colors">
                {priceFormatted} {symboleDevise}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}