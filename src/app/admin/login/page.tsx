"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setIsLoading(false);

    if (res.ok) {
      window.location.href = "/admin";
      return;
    }

    const result = await res.json().catch(() => ({}));
    setError(result.error || "Nie udało się zalogować.");
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-md w-full px-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Hasło"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none"
          autoFocus
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-60"
        >
          {isLoading ? "Logowanie..." : "Zaloguj"}
        </button>
      </form>
    </main>
  );
}
