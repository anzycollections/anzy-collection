"use client";

import { useStore } from "@/context/StoreContext";

export default function CategoryManager() {
  const { content, saveContent } = useStore();

  const toggleCategoryVisibility = (id: string) => {
    const newCategories = content.categories.map(c => c.id === id ? { ...c, visible: !c.visible } : c);
    saveContent({ ...content, categories: newCategories });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E88D9E]/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E88D9E]/10">
        <span className="text-xs font-mono text-gray-500 uppercase">{content.categories.length} catégories</span>
      </div>
      <div className="divide-y divide-gray-50">
        {content.categories.map((cat) => (
          <div key={cat.id} className="px-6 py-4 flex items-center justify-between">
            <span className="text-sm font-medium">{cat.name}</span>
            <button onClick={() => toggleCategoryVisibility(cat.id)}
              className={`w-10 h-5 rounded-full transition ${cat.visible ? "bg-green-500" : "bg-gray-300"} relative`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${cat.visible ? "left-5" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
