"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import countries110m from "world-atlas/countries-110m.json";
import { PhotoChapter } from "../../types/database";

const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 340;
const ANTARCTICA_ID = "010";

type ChapterWithCoords = PhotoChapter & {
  latitude: number;
  longitude: number;
};

export default function PhotoMap({ chapters }: { chapters: PhotoChapter[] }) {
  const router = useRouter();

  const chaptersWithCoords = chapters.filter(
    (c): c is ChapterWithCoords => c.latitude != null && c.longitude != null
  );

  const { fillPath, borderPath, projection } = useMemo(() => {
    const topology = countries110m as unknown as Topology;
    const countries = topology.objects.countries as GeometryCollection;
    const geometries = countries.geometries.filter((g) => g.id !== ANTARCTICA_ID);
    const filtered: GeometryCollection = { ...countries, geometries };

    const countriesFeature = feature(topology, filtered);
    const proj = geoNaturalEarth1().fitSize([VIEW_WIDTH, VIEW_HEIGHT], countriesFeature);
    const path = geoPath(proj);
    const borders = mesh(topology, filtered, (a, b) => a !== b);

    return {
      fillPath: path(countriesFeature) ?? "",
      borderPath: path(borders) ?? "",
      projection: proj,
    };
  }, []);

  if (chaptersWithCoords.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="relative w-full select-none"
        style={{ aspectRatio: `${VIEW_WIDTH} / ${VIEW_HEIGHT}` }}
      >
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
        >
          <path d={fillPath} fill="#e5e5e5" stroke="none" />
          <path
            d={borderPath}
            fill="none"
            stroke="#ffffff"
            strokeWidth={0.6}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {chaptersWithCoords.map((chapter) => {
          const point = projection([chapter.longitude, chapter.latitude]);
          if (!point) return null;
          const [x, y] = point;
          return (
            <button
              key={chapter.id}
              onClick={() => router.push(`/photo-projects/${chapter.slug}`)}
              title={chapter.title}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(x / VIEW_WIDTH) * 100}%`, top: `${(y / VIEW_HEIGHT) * 100}%` }}
            >
              <span className="block w-1.5 h-1.5 rounded-full bg-black/70 ring-4 ring-black/10 group-hover:bg-black group-hover:scale-150 transition-all duration-200" />
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {chapter.location || chapter.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
