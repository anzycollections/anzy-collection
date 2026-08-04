"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";

export default function HeroSection() {
  const { content } = useStore();
  const hero = content.hero;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const images = hero.images || [];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % images.length);
        setFadeOut(false);
      }, 800);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full bg-[#2C2224] text-white min-h-[420px] sm:min-h-[500px] flex flex-col justify-end p-6 sm:p-12 overflow-hidden">
      {images.length > 0 && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-800 ease-in-out"
          style={{
            backgroundImage: `url(${images[currentIdx]})`,
            opacity: fadeOut ? 0 : 0.4,
          }}
        />
      )}
      {images.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center opacity-10"><span className="text-8xl">📷</span></div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2C2224] via-[#2C2224]/40 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-4">
        <span className="inline-block bg-[#E88D9E] text-white text-[10px] font-mono uppercase tracking-widest px-3.5 py-1.5 rounded-full font-semibold">{hero.badge}</span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-tight leading-none text-white">{hero.title}</h1>
        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-light max-w-lg">{hero.subtitle}</p>
        <button onClick={scrollToCatalog} className="bg-[#E88D9E] text-white px-6 py-3 rounded-full font-medium text-xs tracking-widest uppercase hover:bg-[#d67b8c] active:scale-95 transition shadow-lg">{hero.cta}</button>
      </div>
    </section>
  );
}
