"use client";

import Image from "next/image";
import { useStore } from "@/context/StoreContext";

export default function AboutSection() {
  const { content } = useStore();
  const about = content?.about || {};

  // On enlève le faux lien qui cassait le design
  const mainImage = about.image || ""; 
  const subtitle = about.subtitle || "SAVOIR-FAIRE & ÉLÉGANCE";
  const title = about.title || "L'UNIVERS ANZY COLLECTION";
  const founderName = about.founderName || "Mme Meryem B. GBOSSA";
  const founderRole = about.founderRole || "Fondatrice de Anzy Collection";
  const quote =
    about.quote ||
    "« Célébrer la beauté au naturel à travers la richesse de nos traditions. »";
  const description =
    about.description ||
    "Fondée par une jeune entrepreneure africaine passionnée, Anzy Collection est née de la volonté de proposer des soins d'exception, sans additifs ni produits chimiques, façonnés pour sublimer le corps avec patience et discipline.";

  // Petite fonction pour extraire les initiales proprement
  const getInitials = (name: string) => {
    const cleanName = name.replace(/Mme |M\. /g, "").trim();
    const parts = cleanName.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return cleanName ? cleanName.charAt(0).toUpperCase() : "";
  };

  return (
    <section className="pt-2 pb-2 text-[#2C2224] overflow-hidden">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
        
        {/* PETIT CERCLE AVATAR */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#E88D9E] to-pink-100 shadow-md">
          {/* On ajoute bg-gray-100 et flex/center pour le mode "vide" */}
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white bg-gray-50 flex items-center justify-center">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={founderName}
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <span className="text-gray-300 font-serif text-3xl font-light">
                {getInitials(founderName)}
              </span>
            )}
          </div>
        </div>

        {/* TEXTES */}
        <div className="space-y-2 pt-1">
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#E88D9E] font-bold block">
            {subtitle}
          </span>

          <h2 className="text-lg sm:text-2xl font-serif font-bold text-[#2C2224] leading-tight uppercase tracking-wide">
            {title}
          </h2>

          <p className="text-xs font-serif text-gray-600">
            <strong className="text-[#2C2224] font-semibold">{founderName}</strong>{" "}
            <span className="font-sans font-light text-gray-500">— {founderRole}</span>
          </p>

          <p className="text-xs italic font-serif text-[#2C2224] max-w-lg mx-auto">
            {quote}
          </p>

          <p className="text-xs font-sans leading-relaxed text-gray-600 font-light max-w-lg mx-auto">
            {description}
          </p>
        </div>

      </div>
    </section>
  );
}