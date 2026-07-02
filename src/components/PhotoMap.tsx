"use client";

import { useRef, useCallback } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import { useRouter } from "next/navigation";
import type { MapRef } from "react-map-gl/maplibre";
import { PhotoChapter } from "../../types/database";
import "maplibre-gl/dist/maplibre-gl.css";

type ChapterWithCoords = PhotoChapter & {
  latitude: number;
  longitude: number;
};

function getBounds(chapters: ChapterWithCoords[]) {
  const lats = chapters.map((c) => c.latitude);
  const lngs = chapters.map((c) => c.longitude);
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
}

export default function PhotoMap({ chapters }: { chapters: PhotoChapter[] }) {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);

  const chaptersWithCoords = chapters.filter(
    (c): c is ChapterWithCoords => c.latitude != null && c.longitude != null
  );

  const onMapLoad = useCallback(() => {
    if (!mapRef.current || chaptersWithCoords.length === 0) return;
    if (chaptersWithCoords.length === 1) {
      mapRef.current.flyTo({
        center: [chaptersWithCoords[0].longitude, chaptersWithCoords[0].latitude],
        zoom: 8,
      });
      return;
    }
    const bounds = getBounds(chaptersWithCoords);
    mapRef.current.fitBounds(
      [
        [bounds.minLng, bounds.minLat],
        [bounds.maxLng, bounds.maxLat],
      ],
      { padding: 80, duration: 0, maxZoom: 10 }
    );
  }, [chaptersWithCoords]);

  if (chaptersWithCoords.length === 0) return null;

  return (
    <div className="w-full h-[300px] md:h-[420px] rounded-sm overflow-hidden mb-16">
      <Map
        ref={mapRef}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        initialViewState={{ longitude: 21, latitude: 52, zoom: 4 }}
        onLoad={onMapLoad}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {chaptersWithCoords.map((chapter) => (
          <Marker
            key={chapter.id}
            longitude={chapter.longitude}
            latitude={chapter.latitude}
            anchor="center"
          >
            <button
              onClick={() => router.push(`/photo-projects/${chapter.slug}`)}
              title={chapter.title}
              className="group relative"
            >
              <span className="block w-3 h-3 rounded-full bg-black group-hover:scale-150 transition-transform duration-200" />
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {chapter.title}
              </span>
            </button>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
