"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { usePhotoChapters } from "@/hooks/usePhotoProjects";
import { PhotoChapter } from "../../../types/database";
import PhotoMap from "@/components/PhotoMap";

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function PhotoProjectsPage() {
  const { data: chapters = [], isLoading } = usePhotoChapters();

  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl mb-2">Photo Projects</h1>
          {!isLoading && (
            <p className="text-gray-500 tracking-wide">
              {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}
            </p>
          )}
        </div>

        {/* Map (supplementary) */}
        {!isLoading && (
          <div className="max-w-3xl mx-auto mb-8">
            <PhotoMap chapters={chapters} />
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="divide-y divide-gray-200 border-t border-b border-gray-200 max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-6 py-6">
                <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-gray-200 animate-pulse rounded-sm" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chapter list */}
        {!isLoading && chapters.length > 0 && (
          <div className="divide-y divide-gray-200 border-t border-b border-gray-200 max-w-3xl mx-auto">
            {chapters.map((chapter) => (
              <ChapterRow key={chapter.id} chapter={chapter} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && chapters.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No photo projects yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}

function ChapterRow({ chapter }: { chapter: PhotoChapter }) {
  return (
    <Link
      href={`/photo-projects/${chapter.slug}`}
      className="group flex items-center gap-6 py-6 px-3 -mx-3 rounded-sm transition-colors hover:bg-gray-50"
    >
      <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 overflow-hidden rounded-sm bg-gray-100">
        {chapter.cover_image_url ? (
          <Image
            src={chapter.cover_image_url}
            alt={chapter.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="112px"
            loading="lazy"
            quality={75}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400 text-xs text-center px-1">No cover</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {chapter.location && (
          <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-wide leading-tight group-hover:opacity-70 transition-opacity">
            {chapter.location}
          </h2>
        )}
        <p className="text-gray-600 mt-1">{chapter.title}</p>
        <p className="text-sm text-gray-400 mt-1">{formatDate(chapter.shot_date)}</p>
      </div>
      <ArrowRight
        className="w-5 h-5 flex-shrink-0 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all"
        aria-hidden="true"
      />
    </Link>
  );
}
