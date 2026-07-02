"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { usePhotoChapters } from "@/hooks/usePhotoProjects";
import { PhotoChapter } from "../../../types/database";

const PhotoMap = dynamic(() => import("@/components/PhotoMap"), { ssr: false });

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function PhotoProjectsPage() {
  const { data: chapters = [], isLoading } = usePhotoChapters();

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="font-serif text-5xl md:text-6xl mb-4">Photo Projects</h1>
          {!isLoading && (
            <p className="text-gray-500 tracking-wide">
              {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}
            </p>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/3] bg-gray-200 animate-pulse rounded-sm" />
                <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Map */}
        {!isLoading && <PhotoMap chapters={chapters} />}

        {/* Chapter grid */}
        {!isLoading && chapters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
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

function ChapterCard({ chapter }: { chapter: PhotoChapter }) {
  return (
    <Link href={`/photo-projects/${chapter.slug}`} className="block group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-gray-100 mb-4">
        {chapter.cover_image_url ? (
          <Image
            src={chapter.cover_image_url}
            alt={chapter.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            quality={75}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No cover image</span>
          </div>
        )}
      </div>
      <h2 className="font-serif text-xl mb-1 group-hover:opacity-70 transition-opacity">
        {chapter.title}
      </h2>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {chapter.location && <span>{chapter.location}</span>}
        {chapter.location && <span>·</span>}
        <span>{formatDate(chapter.shot_date)}</span>
      </div>
    </Link>
  );
}
