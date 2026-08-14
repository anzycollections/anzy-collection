"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Identifiant ou mot de passe incorrect.");
        setLoading(false);
        return;
      }
      // Rechargement complet (et non un simple router.push) pour garantir
      // que le nouveau cookie de session est bien pris en compte partout.
      window.location.href = "/admin";
    } catch {
      setError("Impossible de se connecter. Vérifie ta connexion internet.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#E88D9E] uppercase font-bold block mb-2">
            Administration
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#2C2224]">Anzy Collection</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-5">
          <div>
            <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase block mb-1.5 font-semibold">
              Identifiant
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
              className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:border-[#E88D9E] outline-none transition"
            />
          </div>

          <div>
            <label className="text-[9px] font-mono tracking-widest text-gray-400 uppercase block mb-1.5 font-semibold">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full p-3.5 rounded-xl border border-gray-200 text-sm focus:border-[#E88D9E] outline-none transition"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl p-3 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#2C2224] hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-[0.2em] shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center mt-6">
          <a href="/" className="text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-[#E88D9E] transition">
            ← Retour à la boutique
          </a>
        </p>
      </div>
    </div>
  );
}
