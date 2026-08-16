"use client";

import { useState } from "react";

interface ShareButtonProps {
  productId: string;
  productName: string;
  className?: string;
}

export default function ShareButton({ productId, productName, className = "" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/produit/${productId}`;

    // Partage natif (WhatsApp, Messages, etc.) — disponible surtout sur mobile.
    if (navigator.share) {
      try {
        await navigator.share({ title: productName, text: productName, url });
        return;
      } catch {
        // La cliente a annulé le partage — pas d'erreur à afficher.
        return;
      }
    }

    // Repli : copie du lien dans le presse-papiers (ordinateur, navigateurs
    // sans partage natif).
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(url);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Partager ce produit"
      className={`flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-md hover:bg-white transition active:scale-95 cursor-pointer ${className}`}
    >
      {copied ? (
        <span className="text-[10px] font-mono px-2 text-emerald-600 font-bold">Copié !</span>
      ) : (
        <span aria-hidden>↗</span>
      )}
    </button>
  );
}
