"use client";

export default function MobileBottomBar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E88D9E]/20 py-3 px-6 flex justify-around items-center shadow-2xl">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex flex-col items-center text-[#2C2224]"
      >
        <span className="text-base">🏠</span>
        <span className="text-[9px] font-mono uppercase">Accueil</span>
      </button>
      <button className="flex flex-col items-center text-[#E88D9E]">
        <span className="text-base">✦</span>
        <span className="text-[9px] font-mono uppercase">En Vedette</span>
      </button>
      <button className="flex flex-col items-center text-[#2C2224]">
        <span className="text-base">🛍️</span>
        <span className="text-[9px] font-mono uppercase">Panier (2)</span>
      </button>
    </div>
  );
}
