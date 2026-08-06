"use client";

import { useState, useEffect } from "react";

export default function FooterTab({ content, saveContent }: { content: any; saveContent: (c: any) => void }) {
  const [footerForm, setFooterForm] = useState(content?.footer || { copyright: "" });
  const [socialForm, setSocialForm] = useState(content?.social || { instagram: "", tiktok: "", facebook: "" });
  const [footerSaved, setFooterSaved] = useState(false);

  useEffect(() => { if (content?.footer) setFooterForm(content.footer); }, [content?.footer]);
  useEffect(() => { if (content?.social) setSocialForm(content.social); }, [content?.social]);

  const saveFooter = () => {
    saveContent({ ...content, footer: footerForm, social: socialForm });
    setFooterSaved(true);
    setTimeout(() => setFooterSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
        <div className="border-b border-gray-100 pb-2">
          <span className="text-[9px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold">SECTION 06</span>
          <h2 className="text-xl font-serif font-bold text-[#2C2224]">Pied de Page (Footer)</h2>
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">© Mentions Légales / Copyright</label>
          <input type="text" value={footerForm.copyright} onChange={(e) => setFooterForm({ ...footerForm, copyright: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" />
        </div>
      </div>
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-lg font-serif font-bold border-b border-gray-100 pb-2">Réseaux Sociaux Officiels</h2>
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Instagram URL</label>
          <input type="url" value={socialForm.instagram} onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" placeholder="https://instagram.com/..." />
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">TikTok URL</label>
          <input type="url" value={socialForm.tiktok} onChange={(e) => setSocialForm({ ...socialForm, tiktok: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" placeholder="https://tiktok.com/..." />
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold block mb-1">Facebook URL</label>
          <input type="url" value={socialForm.facebook} onChange={(e) => setSocialForm({ ...socialForm, facebook: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#E88D9E] focus:outline-none" placeholder="https://facebook.com/..." />
        </div>
        <button
          onClick={saveFooter}
          className={`w-full py-4 rounded-2xl text-[11px] font-mono font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer ${
            footerSaved ? "bg-green-600 text-white scale-102" : "bg-[#2C2224] text-white hover:bg-black"
          }`}
        >
          {footerSaved ? "✓ MODIFICATIONS ENREGISTRÉES" : "ENREGISTRER CONFIGURATION DU FOOTER"}
        </button>
      </div>
    </div>
  );
}
