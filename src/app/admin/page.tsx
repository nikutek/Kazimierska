"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Artwork, ArtworkType } from "../../../types/database";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Artwork>>({});
  const [sortBy, setSortBy] = useState<"order" | "date">("order");
  const artworkTypes: ArtworkType[] = ["sculpture", "painting", "drawing"];

  const ADMIN_PASSWORD = "123"; // Zmień na swoje hasło!

  useEffect(() => {
    if (isAuthenticated) {
      loadArtworks();
    }
  }, [isAuthenticated, sortBy]);

  async function loadArtworks() {
    const { data } = await supabase
      .from("artworks")
      .select("*")
      .order(sortBy === "order" ? "order_index" : "created_at", {
        ascending: sortBy === "order",
      });

    if (data) setArtworks(data);
  }

  async function saveArtwork() {
    if (!editingId) return;

    const { error } = await supabase
      .from("artworks")
      .update(formData)
      .eq("id", editingId);

    if (!error) {
      alert("✅ Zapisano!");
      setEditingId(null);
      loadArtworks();
    } else {
      alert("❌ Błąd: " + error.message);
    }
  }

  async function deleteArtwork(id: string, title: string) {
    if (!confirm(`Czy na pewno chcesz usunąć "${title}"?`)) {
      return;
    }

    const { error } = await supabase.from("artworks").delete().eq("id", id);

    if (!error) {
      alert("🗑️ Usunięto!");
      loadArtworks();
    } else {
      alert("❌ Błąd: " + error.message);
    }
  }

  function startEdit(artwork: Artwork) {
    setEditingId(artwork.id);
    setFormData(artwork);
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && password === ADMIN_PASSWORD) {
                setIsAuthenticated(true);
              }
            }}
            placeholder="Hasło"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black outline-none"
          />
          <button
            onClick={() => {
              if (password === ADMIN_PASSWORD) {
                setIsAuthenticated(true);
              } else {
                alert("❌ Złe hasło");
              }
            }}
            className="w-full mt-4 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Zaloguj
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Edycja Artworks</h1>
            <p className="text-gray-600 mt-2">
              Łącznie: {artworks.length} dzieł
            </p>
          </div>

          {/* Sortowanie */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("order")}
              className={`px-4 py-2 rounded ${
                sortBy === "order"
                  ? "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Sortuj: Kolejność
            </button>
            <button
              onClick={() => setSortBy("date")}
              className={`px-4 py-2 rounded ${
                sortBy === "date"
                  ? "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Sortuj: Data dodania
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="border-2 border-gray-200 p-6 rounded-lg"
            >
              {editingId === artwork.id ? (
                // Formularz edycji
                <div className="space-y-4">
                  {/* Zdjęcie na górze */}
                  <div className="w-full max-w-md">
                    <img
                      src={formData.image_url || ""}
                      alt={formData.title || "Artwork"}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>

                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Tytuł"
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                  />

                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Opis"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                  />

                  <fieldset className="space-y-2">
                    <legend className="text-sm text-gray-600">Typ dzieła</legend>
                    <div className="flex flex-wrap gap-4">
                      {artworkTypes.map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <input
                            type="radio"
                            name={`artwork-type-${artwork.id}`}
                            value={type}
                            checked={formData.type === type}
                            onChange={() => setFormData({ ...formData, type })}
                            className="accent-black"
                          />
                          <span className="capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.material || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, material: e.target.value })
                      }
                      placeholder="Materiał"
                      className="px-4 py-2 border border-gray-300 rounded"
                    />

                    <input
                      type="text"
                      value={formData.dimensions || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, dimensions: e.target.value })
                      }
                      placeholder="Wymiary"
                      className="px-4 py-2 border border-gray-300 rounded"
                    />

                    <input
                      type="text"
                      value={formData.technique || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, technique: e.target.value })
                      }
                      placeholder="Technika"
                      className="px-4 py-2 border border-gray-300 rounded"
                    />

                    <input
                      type="number"
                      value={formData.year || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: parseInt(e.target.value) || undefined,
                        })
                      }
                      placeholder="Rok"
                      className="px-4 py-2 border border-gray-300 rounded"
                    />

                    <input
                      type="number"
                      step="0.01"
                      value={formData.price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value) || undefined,
                        })
                      }
                      placeholder="Cena (PLN)"
                      className="px-4 py-2 border border-gray-300 rounded"
                    />

                    {/* NOWE POLE - Kolejność */}
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-600 mb-2">
                        Kolejność wyświetlania (niższy numer = wyżej na liście)
                      </label>
                      <input
                        type="number"
                        value={formData.order_index ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            order_index: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={saveArtwork}
                      className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                      💾 Zapisz
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Anuluj
                    </button>
                  </div>
                </div>
              ) : (
                // Widok podglądu z miniaturką
                <div className="flex gap-6">
                  {/* Numer kolejności */}
                  <div className="flex-shrink-0 w-12 text-center">
                    <div className="text-2xl font-bold text-gray-400">
                      {artwork.order_index ?? "—"}
                    </div>
                    <div className="text-xs text-gray-400">order</div>
                  </div>

                  {/* Miniaturka */}
                  <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Informacje */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{artwork.title}</h3>
                        <p className="text-sm text-gray-500">{artwork.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(artwork)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          ✏️ Edytuj
                        </button>
                        <button
                          onClick={() =>
                            deleteArtwork(artwork.id, artwork.title)
                          }
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          🗑️ Usuń
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>Materiał: {artwork.material || "—"}</div>
                      <div>Wymiary: {artwork.dimensions || "—"}</div>
                      <div>Technika: {artwork.technique || "—"}</div>
                      <div>Rok: {artwork.year || "—"}</div>
                      <div>
                        Cena: {artwork.price ? `${artwork.price} PLN` : "—"}
                      </div>
                    </div>

                    {artwork.description && (
                      <p className="mt-4 text-sm text-gray-700">
                        {artwork.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
