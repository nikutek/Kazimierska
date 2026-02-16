import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function getRandomArtwork() {
  // 1. Najpierw policz ile jest artworks
  const { count } = await supabase
    .from("artworks")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  if (!count || count === 0) {
    return null;
  }

  // 2. Wygeneruj losowy offset
  const randomOffset = Math.floor(Math.random() * count);

  // 3. Pobierz TYLKO JEDEN artwork z tym offsetem
  const { data: artwork } = await supabase
    .from("artworks")
    .select("id, title, image_url, type, year, material")
    .eq("is_published", true)
    .order("order_index", { ascending: true })
    .range(randomOffset, randomOffset)
    .single();

  return artwork;
}

// Cache na godzinę
export const revalidate = 3600;

export default async function Home() {
  const artwork = await getRandomArtwork();

  return (
    <main className="h-screen w-screen overflow-hidden bg-white">
      {/* Kontener zajmujący całą wysokość minus nawigacja */}
      <div className="h-full pt-20 px-6 lg:px-8">
        {/* Grid z pełną wysokością */}
        <div className="h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-end pb-12 lg:pb-20">
          {/* Left - Image (automatycznie dopasowany) */}
          <div className="relative h-[60vh] lg:h-[70vh] w-full">
            {artwork ? (
              <>
                <Link href={`/portfolio/${artwork.id}`}>
                  <Image
                    src={artwork.image_url}
                    alt={artwork.title}
                    fill
                    className="object-contain object-bottom z-100"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </Link>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No artwork available
              </div>
            )}
          </div>

          {/* Right - Text */}
          <div className="flex flex-col justify-end h-full pb-8 lg:pb-0">
            <div className="space-y-6 lg:space-y-8">
              <p className="font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl italic text-gray-700 leading-relaxed">
                &ldquo;From life&apos;s wounds, I sculpted calm; today I tell of
                human essence through silence.&rdquo;
              </p>

              <div className="pt-4">
                <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">
                  Est. 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
