"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";

export default function HeroSection() {
  const { content } = useStore();
  const hero = content?.hero || {};
  
  // État pour suivre l'index de l'image actuellement affichée
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effet pour faire défiler les images automatiquement toutes les 2 secondes
  useEffect(() => {
    if (!hero.images || hero.images.length <= 1) return; // Pas besoin de timer s'il y a 0 ou 1 image

    const intervalId = setInterval(() => {
      // Ajout de ?.length et || 1 pour satisfaire TypeScript dans la closure
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % (hero.images?.length || 1));
    }, 2000); // Temps d'affichage par image modifié ici (2000ms = 2 secondes)

    return () => clearInterval(intervalId); // Nettoyage lors du démontage du composant
  }, [hero.images]);

  return (
    <section className="relative w-full bg-[#FAF7F5] px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* h-[520px] verrouillé, justify-between sépare le haut et le bas */}
        <div className="relative w-full h-[520px] rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between p-8 text-center">
          
          {/* GESTION DU CARROUSEL AVEC FONDU */}
          {hero.images && hero.images.length > 0 ? (
            // Ajout du chaînage optionnel (?.) pour rassurer TypeScript
            hero.images?.map((imgUrl, index) => (
              <Image 
                key={index}
                src={imgUrl} 
                alt={`Hero ${index}`} 
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 1152px"
                // La transition gère le fondu. L'opacité est à 100 si c'est la bonne image, 0 sinon.
                className={`object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`} 
              />
            ))
          ) : (
            <div className="absolute inset-0 bg-[#E88D9E]/10" />
          )}

          <div className="absolute inset-0 bg-black/35 pointer-events-none z-[1]" />
          
          {/* Bloc du HAUT */}
          <div className="relative z-10 space-y-4 pt-4">
            <span className="inline-block text-[10px] font-mono tracking-[0.3em] uppercase bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 text-white">
              {hero.badge || "NOUVELLE SAISON 2026"}
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight leading-tight text-white">
              {hero.title || "BIENVENUE CHEZ ANZY"}
            </h1>
          </div>

          {/* Bloc du BAS */}
          <div className="relative z-10 pb-4 space-y-4">
            <p className="text-xs sm:text-sm text-gray-200">
              {hero.subtitle || "Découvrez notre collection exclusive."}
            </p>
            <a 
              href="#catalog" 
              className="inline-block bg-[#E88D9E] text-white px-8 py-3.5 rounded-2xl text-[11px] font-mono font-bold uppercase tracking-widest shadow-lg hover:bg-white hover:text-[#2C2224] transition-all"
            >
              {hero.buttonText || "DÉCOUVRIR LA COLLECTION ↓"}
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}