"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PhotoChapter, Photo } from "../../../../types/database";

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

type View = { type: "list" } | { type: "chapter"; chapter: PhotoChapter };

export default function AdminPhotosPage() {
  const [chapters, setChapters] = useState<PhotoChapter[]>([]);
  const [view, setView] = useState<View>({ type: "list" });
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
      // refresh chapter view if open
      if (view.type === "chapter") {
        const updated = await fetch("/api/admin/photos/chapters");
        if (updated.ok) {
          const data = await updated.json();
          setChapters(data.chapters);
          const fresh = data.chapters.find((c: PhotoChapter) => c.id === editingId);
          if (fresh) setView({ type: "chapter", chapter: fresh });
        }
      }
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
      setView({ type: "list" });
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
        {view.type === "list" ? (
          <ListView
            chapters={chapters}
            isCreating={isCreating}
            editingId={editingId}
            form={form}
            onChange={f}
            onStartCreate={startCreate}
            onStartEdit={startEdit}
            onSave={isCreating ? createChapter : saveChapter}
            onCancel={cancelForm}
            onDelete={deleteChapter}
            onTogglePublish={togglePublish}
            onOpenChapter={(chapter) => setView({ type: "chapter", chapter })}
          />
        ) : (
          <ChapterView
            chapter={view.chapter}
            editingId={editingId}
            form={form}
            onChange={f}
            onStartEdit={startEdit}
            onSave={saveChapter}
            onCancel={cancelForm}
            onDelete={deleteChapter}
            onTogglePublish={togglePublish}
            onBack={() => { setView({ type: "list" }); cancelForm(); loadChapters(); }}
            onCoverChanged={(url) => setView({ type: "chapter", chapter: { ...view.chapter, cover_image_url: url } })}
            showToast={showToast}
          />
        )}
      </div>
    </main>
  );
}

// ─── List View ───────────────────────────────────────────────────────────────

function ListView({
  chapters, isCreating, editingId, form, onChange,
  onStartCreate, onStartEdit, onSave, onCancel, onDelete, onTogglePublish, onOpenChapter,
}: {
  chapters: PhotoChapter[];
  isCreating: boolean;
  editingId: string | null;
  form: FormData;
  onChange: (key: keyof FormData, value: string | boolean) => void;
  onStartCreate: () => void;
  onStartEdit: (c: PhotoChapter) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string, title: string) => void;
  onTogglePublish: (c: PhotoChapter) => void;
  onOpenChapter: (c: PhotoChapter) => void;
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Photo Projects</h1>
          <p className="text-gray-500 mt-1">{chapters.length} chapterów</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm">
            ← Artworks
          </Link>
          <button onClick={onStartCreate} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-sm">
            ➕ Nowy chapter
          </button>
        </div>
      </div>

      {isCreating && (
        <ChapterForm form={form} isCreating onChange={onChange} onSave={onSave} onCancel={onCancel} />
      )}

      <div className="space-y-4">
        {chapters.length === 0 && !isCreating && (
          <p className="text-gray-400 text-center py-16">Brak chapterów. Dodaj pierwszy.</p>
        )}
        {chapters.map((chapter) => (
          <div key={chapter.id} className={`border-2 rounded-lg p-5 ${editingId === chapter.id ? "border-blue-300 bg-blue-50" : "border-gray-200"}`}>
            {editingId === chapter.id ? (
              <ChapterForm form={form} isCreating={false} onChange={onChange} onSave={onSave} onCancel={onCancel} />
            ) : (
              <div className="flex gap-4">
                <button onClick={() => onOpenChapter(chapter)} className="flex-shrink-0">
                  {chapter.cover_image_url ? (
                    <img src={chapter.cover_image_url} alt={chapter.title} className="w-20 h-20 object-cover rounded hover:opacity-80 transition-opacity" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">brak cover</div>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <button onClick={() => onOpenChapter(chapter)} className="text-left">
                      <h3 className="text-xl font-bold hover:underline">{chapter.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {chapter.location && `${chapter.location} · `}
                        {chapter.shot_date} ·{" "}
                        <span className={chapter.is_published ? "text-emerald-600" : "text-gray-400"}>
                          {chapter.is_published ? "opublikowany" : "ukryty"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 font-mono">/photo-projects/{chapter.slug}</p>
                    </button>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => onTogglePublish(chapter)} className={`px-3 py-1.5 rounded text-sm ${chapter.is_published ? "bg-gray-200 hover:bg-gray-300" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}>
                        {chapter.is_published ? "Ukryj" : "Publikuj"}
                      </button>
                      <button onClick={() => onStartEdit(chapter)} className="px-3 py-1.5 rounded text-sm bg-blue-500 text-white hover:bg-blue-600">✏️</button>
                      <button onClick={() => onDelete(chapter.id, chapter.title)} className="px-3 py-1.5 rounded text-sm bg-red-500 text-white hover:bg-red-600">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Chapter View (photos) ────────────────────────────────────────────────────

function ChapterView({
  chapter, editingId, form, onChange, onStartEdit, onSave, onCancel,
  onDelete, onTogglePublish, onBack, onCoverChanged, showToast,
}: {
  chapter: PhotoChapter;
  editingId: string | null;
  form: FormData;
  onChange: (key: keyof FormData, value: string | boolean) => void;
  onStartEdit: (c: PhotoChapter) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string, title: string) => void;
  onTogglePublish: (c: PhotoChapter) => void;
  onBack: () => void;
  onCoverChanged: (url: string) => void;
  showToast: (msg: string) => void;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPhotos();
  }, [chapter.id]);

  async function loadPhotos() {
    const res = await fetch(`/api/admin/photos/chapters/${chapter.id}/photos`);
    if (res.ok) {
      const data = await res.json();
      setPhotos(data.photos);
    }
  }

  async function handleUpload(files: FileList) {
    if (files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(`Przesyłanie ${files.length} zdjęć...`);

    const fd = new FormData();
    fd.append("chapter_id", chapter.id);
    for (const file of Array.from(files)) {
      fd.append("files", file);
    }

    const res = await fetch("/api/admin/photos/upload", { method: "POST", body: fd });
    const result = await res.json();

    setIsUploading(false);
    setUploadProgress(null);

    if (res.ok) {
      showToast(`✅ Przesłano ${result.uploaded} zdjęć`);
      if (result.errors?.length > 0) {
        alert("Błędy:\n" + result.errors.join("\n"));
      }
      loadPhotos();
      // If cover was auto-set, refresh it
      if (!chapter.cover_image_url && result.photos?.[0]) {
        onCoverChanged(result.photos[0].image_url);
      }
    } else {
      alert("❌ " + result.error);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function setCover(photo: Photo) {
    const res = await fetch(`/api/admin/photos/${photo.id}/cover`, { method: "PATCH" });
    if (res.ok) {
      showToast("✅ Cover ustawiony");
      onCoverChanged(photo.image_url);
    }
  }

  async function deletePhoto(photo: Photo) {
    if (!confirm("Usunąć to zdjęcie?")) return;
    const res = await fetch(`/api/admin/photos/${photo.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("🗑️ Usunięto");
      loadPhotos();
      if (chapter.cover_image_url === photo.image_url) {
        onCoverChanged("");
      }
    }
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-gray-500 hover:text-black transition-colors">← Chaptery</button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{chapter.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {chapter.location && `${chapter.location} · `}{chapter.shot_date} ·{" "}
            <span className={chapter.is_published ? "text-emerald-600" : "text-gray-400"}>
              {chapter.is_published ? "opublikowany" : "ukryty"}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onTogglePublish(chapter)} className={`px-3 py-1.5 rounded text-sm ${chapter.is_published ? "bg-gray-200 hover:bg-gray-300" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}>
            {chapter.is_published ? "Ukryj" : "Publikuj"}
          </button>
          <button onClick={() => onStartEdit(chapter)} className="px-3 py-1.5 rounded text-sm bg-blue-500 text-white hover:bg-blue-600">✏️ Edytuj</button>
          <button onClick={() => onDelete(chapter.id, chapter.title)} className="px-3 py-1.5 rounded text-sm bg-red-500 text-white hover:bg-red-600">🗑️ Usuń</button>
        </div>
      </div>

      {editingId === chapter.id && (
        <ChapterForm form={form} isCreating={false} onChange={onChange} onSave={onSave} onCancel={onCancel} />
      )}

      {/* Upload area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-8 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={isUploading}
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
          className="hidden"
          id="photo-upload"
        />
        {isUploading ? (
          <div>
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-600">{uploadProgress}</p>
          </div>
        ) : (
          <label htmlFor="photo-upload" className="cursor-pointer">
            <p className="text-lg font-medium mb-1">Przeciągnij zdjęcia lub kliknij</p>
            <p className="text-sm text-gray-500">Wiele plików naraz · JPG, PNG, WebP · automatyczna kompresja WebP</p>
            <div className="mt-4 px-6 py-2 bg-black text-white rounded inline-block hover:bg-gray-800 transition-colors">
              Wybierz pliki
            </div>
          </label>
        )}
      </div>

      {/* Photos grid */}
      <div>
        <p className="text-sm text-gray-500 mb-4">{photos.length} zdjęć</p>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.image_url}
                alt=""
                className={`w-full aspect-square object-cover rounded ${chapter.cover_image_url === photo.image_url ? "ring-2 ring-black" : ""}`}
              />
              {chapter.cover_image_url === photo.image_url && (
                <span className="absolute top-1 left-1 text-xs bg-black text-white px-1.5 py-0.5 rounded">cover</span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                <button
                  onClick={() => setCover(photo)}
                  className="px-2 py-1 bg-white text-black text-xs rounded hover:bg-gray-100"
                  title="Ustaw jako cover"
                >
                  Cover
                </button>
                <button
                  onClick={() => deletePhoto(photo)}
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
        {photos.length === 0 && (
          <p className="text-gray-400 text-center py-12">Brak zdjęć. Dodaj pierwsze.</p>
        )}
      </div>
    </>
  );
}

// ─── Chapter Form ─────────────────────────────────────────────────────────────

function ChapterForm({
  form, isCreating, onChange, onSave, onCancel,
}: {
  form: FormData;
  isCreating: boolean;
  onChange: (key: keyof FormData, value: string | boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [isGeocoding, setIsGeocoding] = useState(false);

  async function geocode() {
    const location = form.location.trim();
    if (!location) return;
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data.length > 0) {
        onChange("latitude", parseFloat(data[0].lat).toFixed(6));
        onChange("longitude", parseFloat(data[0].lon).toFixed(6));
      } else {
        alert(`Nie znaleziono: "${location}"`);
      }
    } catch {
      alert("Błąd geocodowania. Sprawdź połączenie.");
    } finally {
      setIsGeocoding(false);
    }
  }

  return (
    <div className={`border-2 rounded-lg p-6 mb-6 ${isCreating ? "border-emerald-300 bg-emerald-50" : "border-blue-300 bg-blue-50"}`}>
      <h2 className="text-xl font-bold mb-4">{isCreating ? "Nowy chapter" : "Edytuj chapter"}</h2>
      <div className="space-y-3">
        <input type="text" value={form.title} onChange={(e) => onChange("title", e.target.value)} placeholder="Tytuł *" className="w-full px-4 py-2 border border-gray-300 rounded" />
        <textarea value={form.description} onChange={(e) => onChange("description", e.target.value)} placeholder="Opis (opcjonalny)" rows={2} className="w-full px-4 py-2 border border-gray-300 rounded" />
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 flex gap-2">
            <input
              type="text"
              value={form.location}
              onChange={(e) => onChange("location", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && geocode()}
              placeholder="Lokalizacja (np. Kazimierz Dolny)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={geocode}
              disabled={isGeocoding || !form.location.trim()}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black disabled:opacity-40 text-sm whitespace-nowrap"
            >
              {isGeocoding ? "..." : "📍 Pobierz"}
            </button>
          </div>
          <input type="number" step="any" value={form.latitude} onChange={(e) => onChange("latitude", e.target.value)} placeholder="Szerokość (lat)" className="px-4 py-2 border border-gray-300 rounded text-sm" />
          <input type="number" step="any" value={form.longitude} onChange={(e) => onChange("longitude", e.target.value)} placeholder="Długość (lng)" className="px-4 py-2 border border-gray-300 rounded text-sm" />
          <div className="col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Data sesji zdjęciowej *</label>
            <input type="date" value={form.shot_date} onChange={(e) => onChange("shot_date", e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={(e) => onChange("is_published", e.target.checked)} className="accent-black" />
          Opublikuj od razu
        </label>
        <div className="flex gap-3 pt-2">
          <button onClick={onSave} className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">{isCreating ? "✅ Dodaj" : "💾 Zapisz"}</button>
          <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300">Anuluj</button>
        </div>
      </div>
    </div>
  );
}
