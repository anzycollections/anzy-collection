"use client";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderSuccessModal({ isOpen, onClose }: OrderSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center space-y-6 animate-in zoom-in-95 duration-300">
        
        <div className="w-16 h-16 bg-[#FAF7F5] border border-[#E88D9E]/30 text-[#E88D9E] rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
          ✦
        </div>

        <div className="space-y-2">
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#E88D9E] font-bold">
            ANZY COLLECTION
          </span>
          <h2 className="text-xl font-serif font-normal text-[#2C2224]">
            Commande enregistrée avec succès
          </h2>
          <p className="text-xs text-gray-500 font-light leading-relaxed px-4">
            Nous avons bien reçu votre demande. Votre commande est actuellement <strong className="text-[#2C2224]">en attente de validation</strong>. Notre équipe vous contactera dans les <strong className="text-[#2C2224]">24 heures</strong> pour finaliser la livraison.
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-100/60 rounded-2xl p-3 text-[11px] font-mono text-orange-700">
          ⏳ Statut : En attente de confirmation
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 bg-[#2C2224] text-white text-[10px] font-mono uppercase tracking-[0.2em] rounded-xl hover:bg-[#E88D9E] transition shadow-md cursor-pointer"
        >
          Compris, retour à la boutique
        </button>
      </div>
    </div>
  );
}