"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getPhotoChapterBySlug, getChapterPhotos } from "@/lib/queries";
import { Photo } from "../../../../types/database";

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function ChapterPage() {
  const { slug } = useParams<{ slug: string }>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: chapter, isLoading: chapterLoading } = useQuery({
    queryKey: ["photo_chapter", slug],
    queryFn: () => getPhotoChapterBySlug(slug),
    enabled: !!slug,
  });

  const { data: photos = [], isLoading: photosLoading } = useQuery({
    queryKey: ["photos", chapter?.id],
    queryFn: () => getChapterPhotos(chapter!.id),
    enabled: !!chapter?.id,
  });

  const isLoading = chapterLoading || (!!chapter && photosLoading);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null));
  }, [photos.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null));
  }, [photos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "unset";
    };
  }, [lightboxIndex, prev, next]);

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-12" />
          <div className="h-12 w-2/3 bg-gray-200 animate-pulse rounded mb-4" />
          <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/2] bg-gray-200 animate-pulse rounded-sm" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Not found
  if (!chapterLoading && !chapter) {
    return (
      <main className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center py-20">
          <p className="text-gray-400 text-lg mb-8">Chapter not found.</p>
          <Link
            href="/photo-projects"
            className="inline-flex items-center gap-2 text-sm tracking-wider uppercase opacity-60 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Photo Projects
          </Link>
        </div>
      </main>
    );
  }

  if (!chapter) return null;

  return (
    <>
      <main className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/photo-projects"
            className="inline-flex items-center gap-2 mb-12 text-sm tracking-wider uppercase opacity-60 hover:opacity-100 transition-opacity group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Photo Projects
          </Link>

          {/* Header */}
          <div className="mb-16">
            {chapter.location ? (
              <>
                <h1 className="font-serif text-5xl md:text-6xl mb-2 uppercase tracking-wide leading-tight">
                  {chapter.location}
                </h1>
                <p className="text-lg text-gray-600">{chapter.title}</p>
              </>
            ) : (
              <h1 className="font-serif text-5xl md:text-6xl mb-2">{chapter.title}</h1>
            )}
            <p className="mt-2 text-sm text-gray-400">
              {formatDate(chapter.shot_date)} · {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </p>
            {chapter.description && (
              <p className="mt-6 text-gray-600 leading-relaxed max-w-2xl">
                {chapter.description}
              </p>
            )}
          </div>

          {/* Photo grid — 2 columns */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {photos.map((photo, index) => (
                <PhotoCell
                  key={photo.id}
                  photo={photo}
                  index={index}
                  onClick={openLightbox}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400">No photos in this chapter yet.</p>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}

function PhotoCell({
  photo,
  index,
  onClick,
}: {
  photo: Photo;
  index: number;
  onClick: (index: number) => void;
}) {
  return (
    <button
      onClick={() => onClick(index)}
      className="relative aspect-[3/2] overflow-hidden rounded-sm bg-gray-100 block w-full group"
    >
      <Image
        src={photo.image_url}
        alt=""
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 768px) 100vw, 50vw"
        loading="lazy"
        quality={80}
      />
    </button>
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[index];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
        aria-label="Close"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-6 text-white/50 text-sm tabular-nums">
        {index + 1} / {photos.length}
      </div>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 text-white/70 hover:text-white transition-colors z-10 p-2"
          aria-label="Previous"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-h-[90vh] max-w-[90vw] w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.image_url}
          alt=""
          fill
          className="object-contain"
          sizes="90vw"
          quality={90}
          priority
        />
      </div>

      {/* Next */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 text-white/70 hover:text-white transition-colors z-10 p-2"
          aria-label="Next"
        >
          <ChevronRight className="w-10 h-10" />
        </button>
      )}
    </div>
  );
}
