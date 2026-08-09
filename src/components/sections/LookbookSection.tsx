"use client";

import Image from "next/image";
import { useStore } from "@/context/StoreContext";

export default function LookbookSection() {
  const { content } = useStore();
  const items = content?.lookbook || [];

  if (items.length === 0) return null;

  return (
    <section className="space-y-6 pt-10">
      <div className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2 px-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {items.map((item) => {
          const card = (
            <div className="relative w-[240px] sm:w-[300px] aspect-[4/5] rounded-3xl overflow-hidden shrink-0 snap-start shadow-md">
              <Image
                src={item.imageUrl}
                alt={item.title || "Lookbook"}
                fill
                sizes="(max-width: 640px) 240px, 300px"
                className="object-cover"
              />
              {(item.title || item.subtitle) && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 space-y-0.5">
                    {item.title && <h3 className="text-white font-serif text-lg leading-snug">{item.title}</h3>}
                    {item.subtitle && <p className="text-white/80 text-[11px] font-light">{item.subtitle}</p>}
                  </div>
                </>
              )}
            </div>
          );

          return item.link ? (
            <a key={item.id} href={item.link} className="shrink-0">{card}</a>
          ) : (
            <div key={item.id}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
