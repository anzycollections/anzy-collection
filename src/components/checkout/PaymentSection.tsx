"use client";

interface PaymentSectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: "mobile_money" | "transfer") => void;
  transferService: string;
  setTransferService: (service: string) => void;
  mtcnCode: string;
  setMtcnCode: (code: string) => void;
  mtcnError: string;
  receiptFile: File | null;
  receiptPreview: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setReceiptFile: (file: File | null) => void;
  setReceiptPreview: (preview: string) => void;
}

export default function PaymentSection({
  paymentMethod, setPaymentMethod,
  transferService, setTransferService,
  mtcnCode, setMtcnCode, mtcnError,
  receiptFile, receiptPreview, handleFileChange,
  setReceiptFile, setReceiptPreview,
}: PaymentSectionProps) {
  return (
    <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="font-serif font-bold text-lg mb-6 border-b pb-4">2. Paiement</h2>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setPaymentMethod("mobile_money")}
          className={`py-3 px-2 text-xs font-mono font-bold rounded-xl border transition-all ${
            paymentMethod === "mobile_money" ? "bg-[#2C2224] text-white border-[#2C2224]" : "bg-white text-gray-500 border-gray-200 hover:border-[#E88D9E]"
          }`}
        >
          Mobile Money
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("transfer")}
          className={`py-3 px-2 text-xs font-mono font-bold rounded-xl border transition-all ${
            paymentMethod === "transfer" ? "bg-[#2C2224] text-white border-[#2C2224]" : "bg-white text-gray-500 border-gray-200 hover:border-[#E88D9E]"
          }`}
        >
          Transfert
        </button>
      </div>

      {paymentMethod === "mobile_money" && (
        <div className="space-y-4">
          <div className="bg-[#FAF7F5] p-4 rounded-xl border border-gray-200 text-sm text-gray-600">
            <p className="font-semibold mb-2">Coordonnees de paiement Mobile Money</p>
            <p>Nom : <strong>KOSSI</strong></p>
            <p>Prenoms : <strong>M Bernadette</strong></p>
            <p>Numero : <strong>+229 01 56 64 60 45</strong></p>
            <p className="text-xs mt-3 text-orange-600">Assurez-vous que votre operateur permette ce type de transaction avant tout envoi.</p>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">
              Photo du recu <span className="text-red-400">*</span>
            </label>
            <input type="file" accept="image/*" required={paymentMethod === "mobile_money"} onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#E88D9E]/10 file:text-[#E88D9E] hover:file:bg-[#E88D9E]/20 transition-all cursor-pointer" />
            {receiptPreview && (
              <div className="mt-3 relative inline-block">
                <img src={receiptPreview} alt="Apercu du recu" className="h-20 rounded-lg border" />
                <button type="button" onClick={() => { setReceiptFile(null); setReceiptPreview(""); }} className="absolute -top-2 -right-2 bg-red-400 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center">X</button>
              </div>
            )}
          </div>
        </div>
      )}

      {paymentMethod === "transfer" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Service de transfert <span className="text-red-400">*</span></label>
            <select
              value={transferService}
              onChange={e => { setTransferService(e.target.value); setMtcnCode(""); }}
              className="w-full p-3.5 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#E88D9E] outline-none"
            >
              <option value="MoneyGram">MoneyGram</option>
              <option value="Ria">Ria</option>
              <option value="Western Union">Western Union</option>
            </select>
          </div>
          <div className="bg-[#FAF7F5] p-4 rounded-xl border border-gray-200 text-sm text-gray-600">
            <p className="font-semibold mb-2">Instructions de transfert</p>
            <p>Destinataire : <strong>KOSSI M Bernadette</strong></p>
            <p className="text-xs text-red-500 mt-2">Le nom doit etre saisi exactement comme ci-dessus (dans cet ordre) lors du transfert en agence.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
              Code MTCN <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder={`Code ${transferService}`}
              required
              value={mtcnCode}
              onChange={e => setMtcnCode(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-gray-200 text-sm font-mono focus:border-[#E88D9E] outline-none"
            />
            {mtcnError && <p className="text-xs text-red-500 mt-1">{mtcnError}</p>}
            <p className="text-[10px] text-gray-400 mt-1">Format : {transferService === "MoneyGram" ? "8 chiffres" : transferService === "Western Union" ? "10 chiffres" : "13 chiffres"}</p>
          </div>
        </div>
      )}
    </section>
  );
}
