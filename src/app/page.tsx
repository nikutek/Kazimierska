import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE_URL =
  "https://alatkoasrrsqddjsabif.supabase.co/storage/v1/object/public/artworks/sculpture/Rzezba-5-scaled.webp";

export default async function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-white">
      <div className="h-full pt-20 px-6 lg:px-8 pb-8 lg:pb-12">
        <div className="h-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left - Image */}
          <div className="relative flex-1 min-h-0">
            <Link href="/portfolio" className="block h-full">
              <Image
                src={HERO_IMAGE_URL}
                alt="Featured sculpture"
                fill
                className="object-contain object-bottom scale-[170%]"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Link>
          </div>

          {/* Right - Text */}
          <div className="lg:w-[35%] flex items-end pb-4 lg:pb-14 shrink-0">
            <p className="font-serif text-xl md:text-2xl mb-20 lg:text-3xl xl:text-4xl italic text-gray-700 leading-relaxed">
              &ldquo;From life&apos;s wounds, I sculpted calm; today I tell of
              human essence through silence.&rdquo;
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}