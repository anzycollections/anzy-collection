"use client";

import { useStore } from "@/context/StoreContext";

export default function Footer() {
  const { content } = useStore();
  const { footer, social } = content;

  return (
    <footer className="bg-[#2C2224] text-white pt-12 pb-8 px-6 lg:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-6 text-2xl">
          {social.instagram && <a href={social.instagram} target="_blank" className="hover:text-[#E88D9E] transition">📸</a>}
          {social.tiktok && <a href={social.tiktok} target="_blank" className="hover:text-[#E88D9E] transition">🎵</a>}
          {social.facebook && <a href={social.facebook} target="_blank" className="hover:text-[#E88D9E] transition">📘</a>}
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
          {footer.links.map((link, idx) => (
            <a key={idx} href={link.url} className="hover:text-white transition">{link.label}</a>
          ))}
          <a href="/admin" className="text-[#E88D9E] hover:text-white transition font-medium">Admin</a>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <span className="text-xl font-serif tracking-wider font-bold text-white uppercase">ANZY</span>
          <span>— {footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
