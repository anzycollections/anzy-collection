"use client";

import { Product, useStore } from "@/context/StoreContext";

interface Props {
  products: Product[];
  onEdit: (p: Product) => void;
}

export default function ProductTable({ products, onEdit }: Props) {
  const { content, saveContent } = useStore();

  const updateStock = (id: string, stock: number) => {
    const newProducts = content.products.map(p => p.id === id ? { ...p, stock } : p);
    saveContent({ ...content, products: newProducts });
  };

  const toggleVisibility = (id: string) => {
    const newProducts = content.products.map(p => p.id === id ? { ...p, visible: !p.visible } : p);
    saveContent({ ...content, products: newProducts });
  };

  const deleteProduct = (id: string) => {
    const newProducts = content.products.filter(p => p.id !== id);
    saveContent({ ...content, products: newProducts });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E88D9E]/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF7F5] text-left">
            <tr>
              <th className="px-4 py-3 text-[10px] font-mono uppercase text-gray-500">Produit</th>
              <th className="px-4 py-3 text-[10px] font-mono uppercase text-gray-500">Cat.</th>
              <th className="px-4 py-3 text-[10px] font-mono uppercase text-gray-500">Prix</th>
              <th className="px-4 py-3 text-[10px] font-mono uppercase text-gray-500">Stock</th>
              <th className="px-4 py-3 text-[10px] font-mono uppercase text-gray-500">Visible</th>
              <th className="px-4 py-3 text-[10px] font-mono uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-[#FAF7F5]">
                <td className="px-4 py-3 flex items-center gap-2">
                  {p.images?.[0] ? <img src={p.images[0]} className="w-8 h-8 rounded-lg object-cover" /> : <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs">📷</div>}
                  <span className="font-medium text-xs truncate max-w-[120px]">{p.name}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{p.category}</td>
                <td className="px-4 py-3 text-xs font-medium">{p.price.toLocaleString()} F CFA</td>
                <td className="px-4 py-3"><input type="number" value={p.stock} onChange={e => updateStock(p.id, Number(e.target.value))} className="w-14 px-2 py-1 rounded-lg border border-gray-200 text-xs text-center outline-none" /></td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleVisibility(p.id)} className={`w-10 h-5 rounded-full transition ${p.visible ? "bg-green-500" : "bg-gray-300"} relative`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${p.visible ? "left-5" : "left-0.5"}`} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => onEdit(p)} className="px-2 py-1 text-xs rounded-lg border border-gray-200 hover:border-[#E88D9E] transition">✎</button>
                    <button onClick={() => deleteProduct(p.id)} className="px-2 py-1 text-xs rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
