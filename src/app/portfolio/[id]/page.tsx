"use client";

import { useArtwork } from "@/hooks/useArtworks";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ArtworkPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: artwork, isLoading, error } = useArtwork(id);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Back button skeleton */}
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-12" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image skeleton */}
            <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded-sm" />

            {/* Text skeleton */}
            <div className="space-y-6">
              <div className="h-12 bg-gray-200 animate-pulse rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4" />
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3" />
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !artwork) {
    return (
      <main className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-8">Nie znaleziono dzieła</p>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm tracking-wider uppercase opacity-60 hover:opacity-100 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Powrót do portfolio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        {/* Back button */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 mb-12 text-sm tracking-wider uppercase opacity-60 hover:opacity-100 transition-opacity group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Portfolio
        </Link>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left - Image (3 columns) */}
          <div className="lg:col-span-3">
            <div className="sticky top-32">
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-gray-50">
                <Image
                  src={artwork.image_url}
                  alt={artwork.title}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  quality={90}
                />
              </div>
            </div>
          </div>

          {/* Right - Details (2 columns) */}
          <div className="lg:col-span-2 space-y-8 lg:pt-8">
            {/* Title */}
            <div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                {artwork.title}
              </h1>

              {/* Type badge */}
              <span className="inline-block px-3 py-1 text-xs tracking-widest uppercase bg-gray-100 text-gray-600 rounded-full">
                {artwork.type === "sculpture" && "Rzeźba"}
                {artwork.type === "painting" && "Obraz"}
                {artwork.type === "drawing" && "Grafika"}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Details */}
            <div className="space-y-4">
              {artwork.year && (
                <div className="flex justify-between items-baseline">
                  <span className="text-sm tracking-wider uppercase text-gray-500">
                    Rok
                  </span>
                  <span className="text-lg">{artwork.year}</span>
                </div>
              )}

              {artwork.material && (
                <div className="flex justify-between items-baseline">
                  <span className="text-sm tracking-wider uppercase text-gray-500">
                    Materiał
                  </span>
                  <span className="text-lg text-right">{artwork.material}</span>
                </div>
              )}

              {artwork.technique && (
                <div className="flex justify-between items-baseline">
                  <span className="text-sm tracking-wider uppercase text-gray-500">
                    Technika
                  </span>
                  <span className="text-lg text-right">
                    {artwork.technique}
                  </span>
                </div>
              )}

              {artwork.dimensions && (
                <div className="flex justify-between items-baseline">
                  <span className="text-sm tracking-wider uppercase text-gray-500">
                    Wymiary
                  </span>
                  <span className="text-lg text-right">
                    {artwork.dimensions}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {artwork.description && (
              <>
                <div className="border-t border-gray-200" />
                <div>
                  <h2 className="text-sm tracking-wider uppercase text-gray-500 mb-4">
                    Opis
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {artwork.description}
                  </p>
                </div>
              </>
            )}

            {/* Price / Status */}
            <div className="border-t border-gray-200 pt-8">
              {artwork.is_sold ? (
                <div className="text-center py-4">
                  <span className="inline-block px-6 py-3 bg-gray-100 text-gray-600 text-sm tracking-wider uppercase rounded">
                    Sprzedane
                  </span>
                </div>
              ) : artwork.price ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-4xl font-serif mb-2">
                      {artwork.price.toLocaleString("pl-PL")} PLN
                    </p>
                    <p className="text-sm text-gray-500">+ koszty wysyłki</p>
                  </div>

                  <Link
                    href="/contact"
                    className="block w-full text-center px-8 py-4 bg-black text-white text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors"
                  >
                    Zapytaj o dzieło
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Link
                    href="/contact"
                    className="inline-block px-8 py-3 border-2 border-black text-black text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
                  >
                    Skontaktuj się
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
