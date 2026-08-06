"use client";

import { useStore } from "@/context/StoreContext";

export default function Footer() {
  const { content } = useStore();
  const social = content?.social || {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#FAF7F5] text-[#2C2224] pt-12 pb-8 border-t border-[#E88D9E]/15">
      {/* Utilisation de la largeur maximale 7xl pour exploiter les espaces latéraux */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        
        {/* SECTION HISTOIRE LARGE */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="w-28 h-28 rounded-full overflow-hidden p-1 bg-gradient-to-b from-[#E88D9E]/40 to-transparent shadow-md mx-auto">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80"
              alt="Mme Meryem B. GBOSSA"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div>
            <span className="text-[9px] font-mono tracking-[0.25em] text-[#E88D9E] uppercase font-bold block">
              NOTRE HISTOIRE
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2C2224] tracking-wide uppercase mt-1">
              PURETÉ & TRADITIONS ANCESTRALES
            </h2>
            <p className="text-[11px] font-mono text-gray-500 mt-1">
              Mme Meryem B. GBOSSA — Fondatrice de Anzy Collection
            </p>
          </div>

          <blockquote className="text-xs sm:text-sm text-gray-600 font-serif italic leading-relaxed max-w-2xl mx-auto">
            « Célébrer la beauté au naturel à travers la richesse de nos traditions. »
            <span className="block not-italic font-sans text-xs text-gray-500 font-light mt-2">
              Anzy Collection est née de la volonté de proposer des soins d'exception et gaines colombiennes, façonnés pour sublimer le corps avec patience et discipline.
            </span>
          </blockquote>
        </div>

        {/* SECTION BAS DE PAGE EXPLOITANT TOUT L'ESPACE SUR LARGEUR */}
        <div className="pt-8 border-t border-gray-200/60 space-y-6">
          
          <div className="text-center">
            <h3 className="font-serif text-base font-bold tracking-[0.2em] text-[#2C2224] uppercase">
              ANZY COLLECTION
            </h3>
            <p className="text-[10px] font-serif italic text-gray-400 mt-0.5">
              Maison de Beauté & Gaines
            </p>
          </div>

          {/* LIENS DISTRIBUÉS SANS GASPILLAGE D'ESPACE */}
          <div className="flex flex-wrap items-center justify-between gap-4 max-w-4xl mx-auto text-xs font-mono tracking-widest uppercase text-gray-600 px-4 py-2 bg-white/40 rounded-2xl border border-white/60 backdrop-blur-sm shadow-sm">
            
            {/* Groupe Réseaux */}
            <div className="flex items-center gap-6 mx-auto sm:mx-0">
              <a href={social.instagram || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-[#E88D9E] transition-colors">
                INSTAGRAM
              </a>
              <a href={social.tiktok || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-[#E88D9E] transition-colors">
                TIKTOK
              </a>
              <a href={social.facebook || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-[#E88D9E] transition-colors">
                FACEBOOK
              </a>
            </div>

            {/* Groupe Navigation */}
            <div className="flex items-center gap-6 mx-auto sm:mx-0 text-gray-500">
              <a href="#catalog" className="hover:text-[#2C2224] transition-colors">
                COLLECTION
              </a>
              <a href="/admin" className="hover:text-[#2C2224] transition-colors">
                ADMINISTRATION
              </a>
            </div>

          </div>

          {/* Copyright & Bouton Remonter */}
          <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 pt-2 border-t border-gray-100">
            <p>© 2026 Anzy Collection.</p>
            
            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-[#2C2224] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 font-bold text-[#E88D9E]"
            >
              <span>HAUT</span>
              <span>↑</span>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}