"use client";

import { useState, useEffect } from "react";
import { generateOrderReceiptPdf } from "@/lib/generateReceiptPdf";

interface OrderItem {
  productName: string;
  varianteName?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  customerCountry: string;
  items: OrderItem[];
  shippingMethod: string;
  shippingCost: string;
  paymentMethod: string;
  paymentOperator: string;
  paymentReference: string;
  receiptUrl: string;
  total: string;
  currency: string;
  status: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-amber-100 text-amber-700" },
  paid: { label: "Payée", className: "bg-blue-100 text-blue-700" },
  shipped: { label: "Expédiée", className: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Annulée", className: "bg-red-100 text-red-700" },
};

const NEXT_STATUS: Record<string, { next: string; actionLabel: string }> = {
  pending: { next: "paid", actionLabel: "Marquer payée" },
  paid: { next: "shipped", actionLabel: "Marquer expédiée" },
};

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);

  const handleDownloadReceipt = async (order: Order) => {
    setGeneratingPdfId(order.id);
    try {
      await generateOrderReceiptPdf(order);
    } catch (e) {
      console.error(e);
      alert("Impossible de générer le reçu PDF.");
    } finally {
      setGeneratingPdfId(null);
    }
  };

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      })
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      } else {
        alert("Impossible de mettre à jour le statut de cette commande.");
      }
    } catch {
      alert("Erreur réseau lors de la mise à jour.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
        <div>
          <span className="text-[9px] font-mono tracking-widest text-[#E88D9E] uppercase font-bold">SECTION 08</span>
          <h2 className="text-xl font-serif font-bold text-[#2C2224]">Commandes reçues</h2>
        </div>
        <span className="text-xs font-mono bg-[#FAF7F5] px-3 py-1 rounded-xl border border-gray-200">
          Total : {orders.length}
        </span>
      </div>

      {loading && (
        <p className="text-xs font-mono text-gray-400 italic py-6 text-center">Chargement des commandes...</p>
      )}

      {!loading && error && (
        <p className="text-xs font-mono text-red-500 italic py-6 text-center">
          Impossible de charger les commandes.
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <p className="text-xs font-mono text-gray-400 italic py-6 text-center">
          Aucune commande enregistrée pour le moment.
        </p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((o) => {
            const statusInfo = STATUS_LABELS[o.status] || STATUS_LABELS.pending;
            const nextAction = NEXT_STATUS[o.status];
            return (
              <div key={o.id} className="p-4 rounded-2xl border border-gray-100 bg-[#FAF7F5]/50 space-y-3">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs text-[#2C2224]">{o.customerName}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-gray-500">
                      {o.customerPhone} {o.customerEmail ? `• ${o.customerEmail}` : ""}
                    </p>
                    <p className="text-[10px] font-mono text-gray-400">
                      {o.customerAddress}, {o.customerCity} ({o.customerCountry})
                    </p>
                    <span className="text-[9px] font-mono text-gray-400 block">
                      Reçue le {new Date(o.createdAt).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <div className="text-right space-y-1 shrink-0">
                    <p className="font-mono font-bold text-sm text-[#2C2224]">
                      {Number(o.total).toLocaleString()} {o.currency}
                    </p>
                    <p className="text-[9px] font-mono text-gray-500 uppercase">
                      {o.paymentMethod === "mobile_money" ? "Mobile Money" : `${o.paymentOperator} • ${o.paymentReference}`}
                    </p>
                    {o.receiptUrl ? (
                      <a
                        href={o.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9px] font-mono text-[#E88D9E] hover:text-[#2C2224] underline underline-offset-2"
                      >
                        Voir le justificatif
                      </a>
                    ) : (
                      <span className="text-[9px] font-mono text-gray-400 italic block">
                        Aucun justificatif reçu
                      </span>
                    )}
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-1">
                  {(Array.isArray(o.items) ? o.items : []).map((item, idx) => (
                    <p key={idx} className="text-[10px] font-mono text-gray-500">
                      • {item.productName} {item.varianteName ? `(${item.varianteName})` : ""} x{item.quantity} — {(item.price * item.quantity).toLocaleString()} F CFA
                    </p>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadReceipt(o)}
                    disabled={generatingPdfId === o.id}
                    className="text-[9px] font-mono uppercase font-bold px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[#2C2224] hover:border-[#E88D9E] hover:text-[#E88D9E] transition disabled:opacity-50 cursor-pointer"
                  >
                    {generatingPdfId === o.id ? "Génération..." : "📄 Reçu PDF"}
                  </button>
                  {nextAction && (
                    <button
                      type="button"
                      onClick={() => updateStatus(o.id, nextAction.next)}
                      disabled={updatingId === o.id}
                      className="text-[9px] font-mono uppercase font-bold px-3 py-1.5 rounded-lg bg-[#2C2224] text-white hover:bg-[#E88D9E] transition disabled:opacity-50 cursor-pointer"
                    >
                      {updatingId === o.id ? "..." : nextAction.actionLabel}
                    </button>
                  )}
                  {o.status !== "cancelled" && o.status !== "shipped" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(o.id, "cancelled")}
                      disabled={updatingId === o.id}
                      className="text-[9px] font-mono uppercase font-bold px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-500 hover:bg-red-50 transition disabled:opacity-50 cursor-pointer"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
