"use client";

import { useStore } from "@/context/StoreContext";

export default function HeroSection() {
  const { content } = useStore();
  const hero = content?.hero;

  if (!hero) return null;

  const bgImage = hero.images?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80";

  return (
    <section className="relative w-full py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden glass-card relative min-h-[420px] flex items-center p-8 sm:p-12 border border-[#E88D9E]/20 shadow-xl">
        
        {/* Image de fond en overlay flouté / esthétique */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={bgImage}
            alt={hero.title || "Anzy Collection"}
            className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F5] via-[#FAF7F5]/80 to-transparent" />
        </div>

        {/* Contenu textuel Hero */}
        <div className="relative z-10 max-w-xl space-y-6">
          <span className="glass-pill px-4 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-[0.25em] text-[#E88D9E] uppercase inline-block">
            {hero.badge || "ÉDITION 2026"}
          </span>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2C2224] leading-tight">
            {hero.title || "ANZY COLLECTION"}
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
            {hero.subtitle || "Gaines colombiennes de haute qualité & prothèses en silicone conçues pour sublimer vos courbes au quotidien."}
          </p>

          <div className="pt-2">
            <a
              href="#catalog"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#2C2224] text-white text-xs font-mono font-bold uppercase tracking-widest shadow-lg hover:bg-[#E88D9E] transition-all duration-300 transform active:scale-95"
            >
              <span>{hero.cta || "Découvrir le catalogue"}</span>
              <span>↓</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}