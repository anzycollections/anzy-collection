"use client";

import { useStore } from "@/context/StoreContext";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderSuccessModal({ isOpen, onClose }: OrderSuccessModalProps) {
  const { t } = useStore();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center space-y-6 animate-in zoom-in-95 duration-300">
        
        <div className="space-y-3">
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-gray-400">
            Anzy Collection
          </p>
          <h2 className="text-xl font-serif font-normal text-[#2C2224]">
            {t("checkout.orderTransmitted")}
          </h2>
          <p className="text-xs text-gray-500 font-light leading-relaxed px-2">
            {t("checkout.orderSuccessMessage")}
          </p>
        </div>

        <div className="bg-[#FAF7F5] border border-gray-200/60 rounded-xl py-3 px-4 text-[10px] font-mono uppercase tracking-widest text-[#2C2224]">
          {t("checkout.pendingStatus")}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 bg-[#2C2224] text-white text-[10px] font-mono uppercase tracking-[0.2em] rounded-xl hover:bg-black transition cursor-pointer"
        >
          {t("checkout.backToShop")}
        </button>
      </div>
    </div>
  );
}