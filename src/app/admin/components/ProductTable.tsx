"use client";

import { Product, useStore } from "@/context/StoreContext";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const store = useStore() as any;
  const convertirPrix = store?.convertirPrix || ((p: number) => p);
  const symboleDevise = store?.symboleDevise || "F CFA";

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center text-gray-400 font-mono text-xs uppercase tracking-widest">
        Aucun produit enregistré pour le moment.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-[9px] font-mono uppercase tracking-widest text-gray-400">
              <th className="py-4 px-6">Produit</th>
              <th className="py-4 px-6">Catégorie</th>
              <th className="py-4 px-6">Prix</th>
              <th className="py-4 px-6">Stock</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-sans">
            {products.map((p) => {
              const mainImg = p.images && p.images.length > 0 ? p.images[0] : null;
              return (
                <tr key={p.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      {mainImg ? (
                        <img src={mainImg} alt={p.name} className="w-10 h-10 object-cover rounded-xl border border-gray-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                          📷
                        </div>
                      )}
                      <div>
                        <span className="font-serif font-bold text-[#2C2224] block">{p.name}</span>
                        <span className="text-[9px] font-mono text-gray-400 uppercase">{p.brand || "ANZY COLLECTION"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 font-mono text-[11px] text-gray-500 uppercase">
                    {p.category || "Gaines"}
                  </td>
                  <td className="py-3 px-6 font-mono font-bold text-[#2C2224]">
                    {convertirPrix(p.price).toLocaleString()} {symboleDevise}
                  </td>
                  <td className="py-3 px-6">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      En stock ({p.stock || 10})
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(p)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#2C2224] hover:text-white text-[10px] font-mono uppercase font-bold transition cursor-pointer"
                      >
                        Éditer
                      </button>
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(p.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-500 text-[10px] font-mono uppercase font-bold transition cursor-pointer"
                          title="Supprimer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}