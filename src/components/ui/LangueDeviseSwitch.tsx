"use client";

import { useStore } from "@/context/StoreContext";

export default function LangueDeviseSwitch() {
  const { langue, devise, setLangue, setDevise } = useStore();

  return (
    <div className="flex items-center justify-center gap-2 py-1.5">
      <div className="flex items-center gap-0.5 bg-white/80 rounded-full px-1.5 py-0.5 shadow-sm border border-[#E88D9E]/10">
        <button onClick={() => setLangue("FR")} className={`text-sm p-0.5 transition ${langue === "FR" ? "scale-110" : "opacity-30"}`}>🇫🇷</button>
        <button onClick={() => setLangue("EN")} className={`text-sm p-0.5 transition ${langue === "EN" ? "scale-110" : "opacity-30"}`}>🇬🇧</button>
        <button onClick={() => setLangue("ES")} className={`text-sm p-0.5 transition ${langue === "ES" ? "scale-110" : "opacity-30"}`}>🇪🇸</button>
        <button onClick={() => setLangue("PT")} className={`text-sm p-0.5 transition ${langue === "PT" ? "scale-110" : "opacity-30"}`}>🇵🇹</button>
      </div>
      <div className="flex items-center gap-0.5 bg-white/80 rounded-full px-1.5 py-0.5 shadow-sm border border-[#E88D9E]/10">
        <button onClick={() => setDevise("EUR")} className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${devise === "EUR" ? "bg-[#E88D9E] text-white" : "text-gray-400"}`}>€</button>
        <button onClick={() => setDevise("XOF")} className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${devise === "XOF" ? "bg-[#E88D9E] text-white" : "text-gray-400"}`}>F CFA</button>
        <button onClick={() => setDevise("USD")} className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${devise === "USD" ? "bg-[#E88D9E] text-white" : "text-gray-400"}`}>$</button>
      </div>
    </div>
  );
}
