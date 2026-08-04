interface CategoryBubbleProps {
  id: string;
  name: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

export default function CategoryBubble({ id, name, isActive, onClick }: CategoryBubbleProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex-shrink-0 px-6 py-3 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${
        isActive
          ? "bg-[#E88D9E] text-white shadow-md scale-105"
          : "bg-white text-[#2C2224]/80 border border-[#E88D9E]/20 hover:border-[#E88D9E]"
      }`}
    >
      {name}
    </button>
  );
}
