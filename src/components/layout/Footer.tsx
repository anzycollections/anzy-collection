"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function Footer() {
  const { content } = useStore();
  const social = content?.social || {};
  const copyright = content?.footer?.copyright || "© Anzy Collection.";

  return (
    <footer className="pt-4 pb-8 bg-[#FAF7F5] text-[#2C2224] border-t border-gray-200/60">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        
        {/* LOGO & TITRE FOOTER */}
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold tracking-widest uppercase">
            ANZY COLLECTION
          </h3>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            Maison de Beauté & Gaines
          </p>
        </div>

        {/* LIENS COMPACTS */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-gray-100 shadow-2xs max-w-lg mx-auto">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-mono uppercase tracking-wider font-semibold text-gray-600">
            <a
              href={social.instagram || "https://instagram.com"}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#E88D9E] transition"
            >
              Instagram
            </a>
            <a
              href={social.tiktok || "https://tiktok.com"}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#E88D9E] transition"
            >
              TikTok
            </a>
            <a
              href={social.facebook || "https://facebook.com"}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#E88D9E] transition"
            >
              Facebook
            </a>
            <Link href="/" className="hover:text-[#E88D9E] transition">
              Collection
            </Link>
            <Link href="/admin" className="hover:text-[#E88D9E] transition">
              Administration
            </Link>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 pt-2 border-t border-gray-100 max-w-lg mx-auto">
          <span>© Anzy Collection.</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-[#E88D9E] transition font-bold uppercase cursor-pointer"
          >
            HAUT ↑
          </button>
        </div>

      </div>
    </footer>
  );
}