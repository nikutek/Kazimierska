"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Artwork, ArtworkType } from "../../../types/database";

export default function AdminPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Artwork>>({});
  const [sortBy, setSortBy] = useState<"order" | "date">("order");
  const [showSaveToast, setShowSaveToast] = useState(false);
  const artworkTypes: ArtworkType[] = ["sculpture", "painting", "drawing"];
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadArtworks();
  }, [sortBy]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  function triggerSaveToast() {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setShowSaveToast(true);
    toastTimerRef.current = setTimeout(() => {
      setShowSaveToast(false);
    }, 2500);
  }

  function getNextOrderIndex() {
    if (artworks.length === 0) return 0;
    const maxOrder = Math.max(...artworks.map((a) => a.order_index ?? 0));
    return maxOrder + 1;
  }

  function extractStoragePathFromUrl(imageUrl: string) {
    const marker = "/storage/v1/object/public/artworks/";
    const index = imageUrl.indexOf(marker);
    if (index === -1) return "";
    return imageUrl.slice(index + marker.length);
  }

  function startCreate() {
    setEditingId(null);
    setIsCreating(true);
    setFormData({
      title: "",
      description: "",
      type: "sculpture",
      image_url: "",
      storage_path: "",
      year: undefined,
      price: undefined,
      is_sold: false,
      is_published: true,
      order_index: getNextOrderIndex(),
      dimensions: "",
      material: "",
      technique: "",
    });
  }

  async function createArtwork() {
    const title = (formData.title || "").trim();
    const imageUrl = (formData.image_url || "").trim();
    const resolvedStoragePath =
      (formData.storage_path || "").trim() || extractStoragePathFromUrl(imageUrl);
    const type = formData.type;

    if (!title || !imageUrl || !resolvedStoragePath || !type) {
      alert("❌ Uzupełnij: tytuł, typ, image_url oraz storage_path.");
      return;
    }

    const payload = {
      title,
      description: (formData.description || "").trim() || null,
      type,
      image_url: imageUrl,
      storage_path: resolvedStoragePath,
      year: formData.year ?? null,
      price: formData.price ?? null,
      is_sold: formData.is_sold ?? false,
      is_published: formData.is_published ?? true,
      order_index: formData.order_index ?? getNextOrderIndex(),
      dimensions: (formData.dimensions || "").trim() || null,
      material: (formData.material || "").trim() || null,
      technique: (formData.technique || "").trim() || null,
    };

    const res = await fetch("/api/admin/artworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (res.ok) {
      triggerSaveToast();
      setIsCreating(false);
      setFormData({});
      loadArtworks();
    } else {
      alert("❌ Błąd: " + (result.error || "Nie udało się dodać dzieła."));
    }
  }

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

    const res = await fetch(`/api/admin/artworks/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const result = await res.json();

    if (res.ok) {
      triggerSaveToast();
      setEditingId(null);
      loadArtworks();
    } else {
      alert("❌ Błąd: " + (result.error || "Nie udało się zapisać zmian."));
    }
  }

  async function deleteArtwork(id: string, title: string) {
    if (!confirm(`Czy na pewno chcesz usunąć "${title}"?`)) {
      return;
    }

    const res = await fetch(`/api/admin/artworks/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();

    if (res.ok) {
      alert("🗑️ Usunięto!");
      loadArtworks();
    } else {
      alert("❌ Błąd: " + (result.error || "Nie udało się usunąć dzieła."));
    }
  }

  function startEdit(artwork: Artwork) {
    setEditingId(artwork.id);
    setFormData(artwork);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      {showSaveToast && (
        <div className="fixed right-6 top-24 z-50 rounded-lg bg-black px-4 py-3 text-sm text-white shadow-lg">
          ✅ Zmiany zapisane
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Edycja Artworks</h1>
            <p className="text-gray-600 mt-2">
              Łącznie: {artworks.length} dzieł
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={logout}
              className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-800"
            >
              Wyloguj
            </button>
            <button
              onClick={startCreate}
              className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
            >
              ➕ Dodaj nowe dzieło
            </button>
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

        {isCreating && (
          <div className="border-2 border-emerald-300 bg-emerald-50 p-6 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Nowe dzieło</h2>
              <span className="text-xs uppercase tracking-wide text-emerald-700">
                Tryb dodawania
              </span>
            </div>

            <div className="space-y-4">
              {formData.image_url && (
                <div className="w-full max-w-md">
                  <img
                    src={formData.image_url}
                    alt={formData.title || "Nowe dzieło"}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}

              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Tytuł *"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />

              <input
                type="text"
                value={formData.image_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                placeholder="image_url *"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />

              <input
                type="text"
                value={formData.storage_path || ""}
                onChange={(e) =>
                  setFormData({ ...formData, storage_path: e.target.value })
                }
                placeholder="storage_path * (np. IMG_2818.webp)"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />

              <fieldset className="space-y-2">
                <legend className="text-sm text-gray-600">Typ dzieła *</legend>
                <div className="flex flex-wrap gap-4">
                  {artworkTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type="radio"
                        name="new-artwork-type"
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

              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Opis"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />

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

                <input
                  type="number"
                  value={formData.order_index ?? getNextOrderIndex()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order_index: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Kolejność"
                  className="px-4 py-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={createArtwork}
                  className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  ✅ Dodaj dzieło
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setFormData({});
                  }}
                  className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}

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
