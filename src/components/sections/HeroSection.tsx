"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";

const DEFAULT_SLIDES = [
  "/images/hero-1.jpg",
  "/images/hero-2.jpg",
  "/images/hero-3.jpg",
];

export default function HeroSection() {
  const { content } = useStore();
  const hero = content?.hero || {};

  // Titres & sous-titres configurables
  const badge = hero.badge || "NOUVELLE SAISON 2026";
  const title = hero.title || "BIENVENUE CHEZ ANZY";
  const subtitle = hero.subtitle || "Découvrez notre collection.";
  const buttonText = hero.buttonText || "DÉCOUVRIR LA COLLECTION ↓";

  // Récupération des images (ou fallback sur le tableau par défaut)
  const images: string[] =
    hero.images && Array.isArray(hero.images) && hero.images.length > 0
      ? hero.images
      : DEFAULT_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Défilement automatique avec fondu toutes les 2 secondes
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  const scrollToCatalog = () => {
    const catalogElement = document.getElementById("catalog-section");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.8, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-12">
      <div className="relative w-full min-h-[520px] sm:min-h-[600px] rounded-3xl overflow-hidden shadow-sm flex items-center bg-stone-900">
        
        {/* CAROUSEL D'IMAGES AVEC FONDU */}
        {images.map((img, index) => (
          <div
            key={img + index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
            }`}
          >
            <img
              src={img}
              alt={`Slide Anzy ${index + 1}`}
              className="w-full h-full object-cover object-center"
            />
            {/* Overlay dégradé doux pour lisibilité du texte */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-stone-950/40 to-transparent" />
          </div>
        ))}

        {/* CONTENU TEXTE PAR-DESSUS */}
        <div className="relative z-10 max-w-xl p-6 sm:p-12 space-y-6 text-white">
          {/* BADGE */}
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#E88D9E] font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-xs">
            {badge}
          </span>

          {/* TITRE PRINCIPAL */}
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight uppercase">
            {title}
          </h1>

          {/* SOUS-TITRE */}
          <p className="text-sm sm:text-base font-sans font-light text-stone-200">
            {subtitle}
          </p>

          {/* BOUTON D'ACTION COMPACT & ÉLÉGANT */}
          <div className="pt-1">
            <button
              onClick={scrollToCatalog}
              className="px-5 py-2.5 rounded-xl bg-[#E88D9E] hover:bg-[#2C2224] text-white font-mono text-[11px] font-bold tracking-[0.15em] uppercase shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer inline-flex items-center gap-1.5 border border-white/20"
            >
              {buttonText}
            </button>
          </div>
        </div>

        {/* INDICATEURS DE SLIDES (PETITS POINTS EN BAS) */}
        {images.length > 1 && (
          <div className="absolute bottom-6 right-6 z-10 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Aller à l'image ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}