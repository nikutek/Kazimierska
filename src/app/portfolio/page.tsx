"use client";

import { useState } from "react";
import { useArtworks } from "@/hooks/useArtworks";
import { ArtworkType } from "../../../types/database";
import Image from "next/image";
import Link from "next/link";

export default function PortfolioPage() {
  const [filter, setFilter] = useState<ArtworkType | undefined>();

  const { data: artworks = [], isLoading, error } = useArtworks(filter);

  const filters: { value: ArtworkType | undefined; label: string }[] = [
    { value: undefined, label: "Wszystkie" },
    { value: "sculpture", label: "Rzeźby" },
    { value: "painting", label: "Malarstwo" },
    { value: "drawing", label: "Grafika" },
  ];

  if (error) {
    return (
      <main className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-red-500">Błąd podczas ładowania dzieł</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="font-serif text-5xl md:text-6xl mb-4">Portfolio</h1>
          <p className="text-gray-500 tracking-wide">
            {isLoading
              ? "..."
              : `${artworks.length} ${artworks.length === 1 ? "dzieło" : "dzieł"}`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-6 mb-16">
          {filters.map((f) => (
            <button
              key={f.label}
              onClick={() => setFilter(f.value)}
              className={`text-sm tracking-wider uppercase transition-opacity ${
                filter === f.value
                  ? "opacity-100 font-medium"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="break-inside-avoid">
                <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded-sm" />
                <div className="mt-4 space-y-2">
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!isLoading && artworks.length > 0 && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {artworks.map((artwork) => (
              <Link
                key={artwork.id}
                href={`/portfolio/${artwork.id}`}
                className="block break-inside-avoid group"
              >
                <div className="relative overflow-hidden rounded-sm bg-gray-100">
                  <Image
                    src={artwork.image_url}
                    alt={artwork.title}
                    width={800}
                    height={1000}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                    quality={75}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4=" // Placeholder SVG
                  />
                </div>

                <div className="mt-4 px-2">
                  <h3 className="font-serif text-xl mb-1">{artwork.title}</h3>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {artwork.year && <span>{artwork.year}</span>}
                    {artwork.material && (
                      <>
                        <span>·</span>
                        <span>{artwork.material}</span>
                      </>
                    )}
                  </div>

                  {artwork.dimensions && (
                    <p className="text-sm text-gray-400 mt-1">
                      {artwork.dimensions}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && artworks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Brak dzieł do wyświetlenia</p>
          </div>
        )}
      </div>
    </main>
  );
}
