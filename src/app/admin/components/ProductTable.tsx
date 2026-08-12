"use client";

import { Product, useStore } from "@/context/StoreContext";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onDuplicate?: (product: Product) => void;
  onToggleVisible?: (product: Product) => void;
}

export default function ProductTable({ products, onEdit, onDelete, onDuplicate, onToggleVisible }: ProductTableProps) {
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
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-[9px] font-mono uppercase tracking-widest text-gray-400">
              <th className="py-3 pl-4 sm:pl-6 pr-2 w-12"></th>
              <th className="py-3 px-4 sm:px-6">Produit</th>
              <th className="py-3 px-3 sm:px-6">Catégorie</th>
              <th className="py-3 px-3 sm:px-6">Prix</th>
              <th className="py-3 px-3 sm:px-6">Stock</th>
              <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-sans">
            {products.map((p) => {
              const mainImg = p.images && p.images.length > 0 ? p.images[0] : null;
              return (
                <tr key={p.id} className={`hover:bg-gray-50/50 transition ${p.visible === false ? "opacity-50" : ""}`}>
                  <td className="py-3 pl-4 sm:pl-6 pr-2">
                    {onToggleVisible && (
                      <button
                        type="button"
                        onClick={() => onToggleVisible(p)}
                        role="switch"
                        aria-checked={p.visible !== false}
                        title={p.visible === false ? "Rendre visible" : "Masquer"}
                        className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${
                          p.visible === false ? "bg-gray-300" : "bg-emerald-500"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                            p.visible === false ? "translate-x-0" : "translate-x-4"
                          }`}
                        />
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-2.5">
                      {mainImg ? (
                        <img
                          src={mainImg}
                          alt={p.name}
                          className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-xl border border-gray-100 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 shrink-0">
                          📷
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-serif font-bold text-[#2C2224] block truncate text-xs">
                          {p.name}
                          {p.visible === false && (
                            <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold bg-gray-200 text-gray-600 align-middle">
                              MASQUÉ
                            </span>
                          )}
                        </span>
                        <span className="text-[8px] font-mono text-gray-400 uppercase block truncate">
                          {p.brand || "ANZY COLLECTION"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:px-6 font-mono text-[10px] sm:text-[11px] text-gray-500 uppercase">
                    {p.category || "Gaines"}
                  </td>
                  <td className="py-3 px-3 sm:px-6 font-mono font-bold text-[#2C2224] text-xs whitespace-nowrap">
                    {convertirPrix(p.price).toLocaleString()} {symboleDevise}
                  </td>
                  <td className="py-3 px-3 sm:px-6">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                      En stock ({p.stock || 0})
                    </span>
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(p)}
                        className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-gray-100 hover:bg-[#2C2224] hover:text-white text-[9px] sm:text-[10px] font-mono uppercase font-bold transition cursor-pointer"
                      >
                        Éditer
                      </button>
                      {onDuplicate && (
                        <button
                          type="button"
                          onClick={() => onDuplicate(p)}
                          className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-gray-100 hover:bg-[#E88D9E] hover:text-white text-[9px] sm:text-[10px] font-mono uppercase font-bold transition cursor-pointer"
                          title="Dupliquer"
                        >
                          Dupliquer
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(p.id)}
                          className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-500 text-[9px] sm:text-[10px] font-mono uppercase font-bold transition cursor-pointer"
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