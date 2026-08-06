"use client";

import { useStore } from "@/context/StoreContext";

export default function HeroSection() {
  const { content } = useStore();
  const hero = content?.hero || {};

  return (
    <section className="relative w-full bg-[#FAF7F5] px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* h-[520px] verrouillé, justify-between sépare le haut et le bas */}
        <div className="relative w-full h-[520px] rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between p-8 text-center">
          
          {hero.images?.[0] ? (
            <img src={hero.images[0]} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-[#E88D9E]/10" />
          )}
          <div className="absolute inset-0 bg-black/35" />
          
          {/* Bloc du HAUT (Ce que tu as entouré en rouge) */}
          <div className="relative z-10 space-y-4 pt-4">
            <span className="inline-block text-[10px] font-mono tracking-[0.3em] uppercase bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 text-white">
              {hero.badge || "NOUVELLE SAISON 2026"}
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight leading-tight text-white">
              {hero.title || "BIENVENUE CHEZ ANZY"}
            </h1>
          </div>

          {/* Bloc du BAS (Ce que tu as entouré en vert) */}
          <div className="relative z-10 pb-4 space-y-4">
            <p className="text-xs sm:text-sm text-gray-200">
              {hero.subtitle || "Découvrez notre collection exclusive."}
            </p>
            <a 
              href="#catalogue" 
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
