"use client";

import { useStore } from "@/context/StoreContext";

export default function Footer() {
  const { content } = useStore();
  const footer = content.footer || { copyright: "© 2026 Anzy Collection." };
  const social = content.social || {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-28 sm:mt-40 border-t border-[#E88D9E]/15 bg-[#FAF7F5]/50 pt-16 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Ligne principale : Marque & Réseaux */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-sm font-serif font-bold tracking-[0.2em] text-[#2C2224] uppercase block">
              ANZY COLLECTION
            </span>
            <p className="text-[11px] font-light text-gray-400 tracking-wider">
              Haute couture & pièces d'exception
            </p>
          </div>

          {/* Icônes Réseaux (Lignes minimalistes) */}
          <div className="flex items-center space-x-6 text-xs font-mono tracking-widest text-[#2C2224]/70">
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noreferrer" className="hover:text-[#E88D9E] transition-colors">
                INSTAGRAM
              </a>
            )}
            {social.tiktok && (
              <a href={social.tiktok} target="_blank" rel="noreferrer" className="hover:text-[#E88D9E] transition-colors">
                TIKTOK
              </a>
            )}
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noreferrer" className="hover:text-[#E88D9E] transition-colors">
                FACEBOOK
              </a>
            )}
            {!social.instagram && !social.tiktok && !social.facebook && (
              <span className="text-[10px] text-gray-300">ANZY.OFFICIAL</span>
            )}
          </div>
        </div>

        {/* Ligne secondaire : Navigation discrète */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-6 text-[10px] font-mono tracking-widest text-gray-400 uppercase border-y border-[#E88D9E]/10 py-6">
          <a href="#catalog" className="hover:text-[#E88D9E] transition">Collection</a>
          <a href="/admin" className="hover:text-[#E88D9E] transition">Administration</a>
        </div>

        {/* Bas de page : Copyright & Flèche discrète */}
        <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 tracking-wider">
          <p className="font-light">{footer.copyright}</p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 hover:text-[#2C2224] transition-colors py-1"
          >
            <span className="uppercase tracking-widest text-[9px]">Haut</span>
            <span className="text-xs group-hover:-translate-y-0.5 transition-transform">↑</span>
          </button>
        </div>

      </div>
    </footer>
  );
}