"use client";

import { useState, useEffect } from "react";

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

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
          {orders.map((o) => (
            <div key={o.id} className="p-4 rounded-2xl border border-gray-100 bg-[#FAF7F5]/50 space-y-3">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs text-[#2C2224]">{o.customerName}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold bg-amber-100 text-amber-700">
                      {o.status}
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
                  {o.receiptUrl && (
                    <a
                      href={o.receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[9px] font-mono text-[#E88D9E] hover:text-[#2C2224] underline underline-offset-2"
                    >
                      Voir le justificatif
                    </a>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
