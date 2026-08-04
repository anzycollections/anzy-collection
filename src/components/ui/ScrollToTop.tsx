"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 md:bottom-8 right-6 z-50 w-10 h-10 rounded-full bg-[#E88D9E] text-white shadow-lg flex items-center justify-center hover:bg-[#d67b8c] transition animate-bounce"
    >
      ↑
    </button>
  );
}
