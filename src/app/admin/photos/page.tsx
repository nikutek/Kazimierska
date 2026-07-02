"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PhotoChapter } from "../../../../types/database";

type FormData = {
  title: string;
  description: string;
  location: string;
  latitude: string;
  longitude: string;
  shot_date: string;
  is_published: boolean;
};

const emptyForm = (): FormData => ({
  title: "",
  description: "",
  location: "",
  latitude: "",
  longitude: "",
  shot_date: "",
  is_published: false,
});

export default function AdminPhotosPage() {
  const [chapters, setChapters] = useState<PhotoChapter[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm());
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadChapters();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function loadChapters() {
    const res = await fetch("/api/admin/photos/chapters");
    if (res.ok) {
      const data = await res.json();
      setChapters(data.chapters);
    }
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setIsCreating(true);
  }

  function startEdit(chapter: PhotoChapter) {
    setIsCreating(false);
    setEditingId(chapter.id);
    setForm({
      title: chapter.title,
      description: chapter.description ?? "",
      location: chapter.location ?? "",
      latitude: chapter.latitude != null ? String(chapter.latitude) : "",
      longitude: chapter.longitude != null ? String(chapter.longitude) : "",
      shot_date: chapter.shot_date,
      is_published: chapter.is_published,
    });
  }

  function cancelForm() {
    setIsCreating(false);
    setEditingId(null);
    setForm(emptyForm());
  }

  async function createChapter() {
    if (!form.title.trim() || !form.shot_date) {
      alert("Tytuł i data sesji są wymagane.");
      return;
    }
    const res = await fetch("/api/admin/photos/chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      }),
    });
    if (res.ok) {
      showToast("✅ Chapter dodany");
      cancelForm();
      loadChapters();
    } else {
      const { error } = await res.json();
      alert("❌ " + error);
    }
  }

  async function saveChapter() {
    if (!editingId) return;
    const res = await fetch(`/api/admin/photos/chapters/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      }),
    });
    if (res.ok) {
      showToast("✅ Zmiany zapisane");
      cancelForm();
      loadChapters();
    } else {
      const { error } = await res.json();
      alert("❌ " + error);
    }
  }

  async function deleteChapter(id: string, title: string) {
    if (!confirm(`Usunąć chapter "${title}"? Usunie też wszystkie jego zdjęcia.`)) return;
    const res = await fetch(`/api/admin/photos/chapters/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("🗑️ Usunięto");
      loadChapters();
    } else {
      const { error } = await res.json();
      alert("❌ " + error);
    }
  }

  async function togglePublish(chapter: PhotoChapter) {
    const res = await fetch(`/api/admin/photos/chapters/${chapter.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !chapter.is_published }),
    });
    if (res.ok) {
      showToast(chapter.is_published ? "Ukryto" : "Opublikowano");
      loadChapters();
    }
  }

  const f = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      {toast && (
        <div className="fixed right-6 top-24 z-50 rounded-lg bg-black px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Photo Projects</h1>
            <p className="text-gray-500 mt-1">{chapters.length} chapterów</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin"
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            >
              ← Artworks
            </Link>
            <button
              onClick={startCreate}
              className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
            >
              ➕ Nowy chapter
            </button>
          </div>
        </div>

        {(isCreating || editingId) && (
          <ChapterForm
            form={form}
            isCreating={isCreating}
            onChange={f}
            onSave={isCreating ? createChapter : saveChapter}
            onCancel={cancelForm}
          />
        )}

        <div className="space-y-4">
          {chapters.length === 0 && !isCreating && (
            <p className="text-gray-400 text-center py-16">
              Brak chapterów. Dodaj pierwszy.
            </p>
          )}
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`border-2 rounded-lg p-5 ${
                editingId === chapter.id
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex gap-4">
                {chapter.cover_image_url && (
                  <img
                    src={chapter.cover_image_url}
                    alt={chapter.title}
                    className="w-20 h-20 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{chapter.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {chapter.location && `${chapter.location} · `}
                        {chapter.shot_date}
                        {" · "}
                        <span
                          className={
                            chapter.is_published
                              ? "text-emerald-600"
                              : "text-gray-400"
                          }
                        >
                          {chapter.is_published ? "opublikowany" : "ukryty"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 font-mono">
                        /photo-projects/{chapter.slug}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => togglePublish(chapter)}
                        className={`px-3 py-1.5 rounded text-sm ${
                          chapter.is_published
                            ? "bg-gray-200 hover:bg-gray-300"
                            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        }`}
                      >
                        {chapter.is_published ? "Ukryj" : "Publikuj"}
                      </button>
                      <button
                        onClick={() => startEdit(chapter)}
                        className="px-3 py-1.5 rounded text-sm bg-blue-500 text-white hover:bg-blue-600"
                      >
                        ✏️ Edytuj
                      </button>
                      <button
                        onClick={() => deleteChapter(chapter.id, chapter.title)}
                        className="px-3 py-1.5 rounded text-sm bg-red-500 text-white hover:bg-red-600"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  {chapter.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {chapter.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function ChapterForm({
  form,
  isCreating,
  onChange,
  onSave,
  onCancel,
}: {
  form: FormData;
  isCreating: boolean;
  onChange: (key: keyof FormData, value: string | boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className={`border-2 rounded-lg p-6 mb-6 ${
        isCreating ? "border-emerald-300 bg-emerald-50" : "border-blue-300 bg-blue-50"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">
        {isCreating ? "Nowy chapter" : "Edytuj chapter"}
      </h2>
      <div className="space-y-3">
        <input
          type="text"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Tytuł *"
          className="w-full px-4 py-2 border border-gray-300 rounded"
        />
        <textarea
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Opis (opcjonalny)"
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={form.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="Lokalizacja (np. Kazimierz Dolny)"
            className="px-4 py-2 border border-gray-300 rounded col-span-2"
          />
          <input
            type="number"
            step="any"
            value={form.latitude}
            onChange={(e) => onChange("latitude", e.target.value)}
            placeholder="Szerokość geograficzna (lat)"
            className="px-4 py-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            step="any"
            value={form.longitude}
            onChange={(e) => onChange("longitude", e.target.value)}
            placeholder="Długość geograficzna (lng)"
            className="px-4 py-2 border border-gray-300 rounded"
          />
          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-1">
              Data sesji zdjęciowej *
            </label>
            <input
              type="date"
              value={form.shot_date}
              onChange={(e) => onChange("shot_date", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => onChange("is_published", e.target.checked)}
            className="accent-black"
          />
          Opublikuj od razu
        </label>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onSave}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            {isCreating ? "✅ Dodaj" : "💾 Zapisz"}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}
