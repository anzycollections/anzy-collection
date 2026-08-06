"use client";

import { useStore } from "@/context/StoreContext";

export default function AboutSection() {
  const { content } = useStore();
  const about = content?.about;

  if (!content || !about) {
    return null;
  }

  return (
    <section id="about" className="space-y-8 scroll-mt-20 pt-8 border-t border-[#E88D9E]/15">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Texte de présentation */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#E88D9E] uppercase font-bold block mb-1">
              {about.subtitle || "Savoir-Faire & Élégance"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#2C2224] leading-tight">
              {about.title || "L'Univers Anzy Collection"}
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
            {about.paragraph1 && <p>{about.paragraph1}</p>}
            {about.paragraph2 && <p>{about.paragraph2}</p>}
          </div>

          <div className="pt-2">
            <p className="text-xs font-serif italic text-[#E88D9E] tracking-wide">
              Pureté & Traditions Ancestrales
            </p>
          </div>
        </div>

        {/* Visuel officiel de présentation */}
        <div className="relative">
          <div className="aspect-[4/3] rounded-3xl bg-white p-3 border border-[#E88D9E]/15 shadow-xl overflow-hidden">
            {about.image ? (
              <img
                src={about.image}
                alt={about.title || "Anzy Collection"}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-full bg-[#FAF7F5] rounded-2xl flex items-center justify-center text-gray-300">
                <span className="text-4xl">📷</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}