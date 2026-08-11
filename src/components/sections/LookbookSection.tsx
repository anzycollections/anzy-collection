"use client";

import { useStore } from "@/context/StoreContext";

export default function LookbookSection() {
  const { content } = useStore();
  const items = content?.lookbook || [];

  if (items.length === 0) return null;

  return (
    <section className="space-y-6 pt-10">
      {items.map((item) => {
        const banner = (
          <div className="relative w-full rounded-3xl overflow-hidden shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.title || "Lookbook"}
              className="w-full h-auto block"
            />
            {(item.title || item.subtitle) && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-1">
                  {item.title && <h3 className="text-white font-serif text-2xl sm:text-3xl leading-snug">{item.title}</h3>}
                  {item.subtitle && <p className="text-white/80 text-sm font-light">{item.subtitle}</p>}
                </div>
              </>
            )}
          </div>
        );

        return item.link ? (
          <a key={item.id} href={item.link} className="block">{banner}</a>
        ) : (
          <div key={item.id}>{banner}</div>
        );
      })}
    </section>
  );
}
