"use client";

import { useStore } from "@/context/StoreContext";

export default function AboutSection() {
  const { content } = useStore();
  const about = content.about;

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative rounded-3xl overflow-hidden h-80 md:h-96 bg-[#F3C5CD]/20">
          {about.image ? (
            <img src={about.image} alt="À propos" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">📷</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#E88D9E]/20 to-transparent" />
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#E88D9E] uppercase block font-semibold">{about.subtitle}</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2C2224] mt-1">{about.title}</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed font-light">{about.paragraph1}</p>
          <p className="text-sm text-gray-600 leading-relaxed font-light">{about.paragraph2}</p>
          {about.stats && about.stats.length > 0 && (
            <div className="flex space-x-8 pt-2">
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
