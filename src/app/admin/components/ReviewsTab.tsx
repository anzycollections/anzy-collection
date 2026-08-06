"use client";

import { useState, useEffect } from "react";
import { getAllReviewsForAdmin, toggleApproveReview, deleteReview } from "@/app/actions/reviews";

export default function ReviewsTab() {
  const [adminReviews, setAdminReviews] = useState<any[]>([]);

  useEffect(() => {
    getAllReviewsForAdmin().then(setAdminReviews);
  }, []);

  const handleToggleReview = async (id: string, currentStatus: boolean) => {
    await toggleApproveReview(id, currentStatus);
    const updated = await getAllReviewsForAdmin();
    setAdminReviews(updated);
  };

  const handleDeleteReviewAdmin = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cet avis ?")) {
      await deleteReview(id);
      const updated = await getAllReviewsForAdmin();
      setAdminReviews(updated);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
        <div>
          <span className="text-[9px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold">SECTION 07</span>
          <h2 className="text-xl font-serif font-bold text-[#2C2224]">Modération des Avis Clients</h2>
        </div>
        <span className="text-xs font-mono bg-[#FAF7F5] px-3 py-1 rounded-xl border border-gray-200">
          Total : {adminReviews.length}
        </span>
      </div>
      {adminReviews.length === 0 ? (
        <p className="text-xs font-mono text-gray-400 italic py-6 text-center">Aucun avis client pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {adminReviews.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl border border-gray-100 bg-[#FAF7F5]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#2C2224]">{r.author}</span>
                  <span className="text-amber-400 text-xs">{"★".repeat(r.rating)}</span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${r.isApproved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {r.isApproved ? "Publié" : "En attente"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-sans italic">"{r.comment}"</p>
                <span className="text-[9px] font-mono text-gray-400 block">
                  Produit ID : {r.productId} • Envoyé le {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleReview(r.id, r.isApproved)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
                    r.isApproved 
                      ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100" 
                      : "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                  }`}
                >
                  {r.isApproved ? "Masquer" : "Valider & Publier"}
                </button>
                <button
                  onClick={() => handleDeleteReviewAdmin(r.id)}
                  className="px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition cursor-pointer"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
