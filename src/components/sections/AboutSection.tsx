"use client";

import { useStore } from "@/context/StoreContext";

export default function AboutSection() {
  const { content } = useStore();
  const about = content.about;

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-[#F3C5CD]/20 border-4 border-[#E88D9E]/20 shadow-xl">
            {about.image ? (
              <img src={about.image} alt="À propos" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">📷</div>
            )}
          </div>
        </div>
        <div className="space-y-4 text-center md:text-left">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase block font-semibold">{about.subtitle}</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2C2224] mt-1">{about.title}</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed font-light">{about.paragraph1}</p>
          <p className="text-sm text-gray-600 leading-relaxed font-light">{about.paragraph2}</p>
          {about.stats && about.stats.length > 0 && (
            <div className="flex justify-center md:justify-start space-x-8 pt-2">
              {about.stats.map((stat, idx) => (
                <div key={idx}>
                  <p className="text-2xl font-serif font-bold text-[#E88D9E]">{stat.value}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
