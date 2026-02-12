import Image from "next/image";

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-white">
      {/* Kontener zajmujący całą wysokość minus nawigacja */}
      <div className="h-full pt-20 px-6 lg:px-8">
        {/* Grid z pełną wysokością */}
        <div className="h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-end pb-12 lg:pb-20">
          {/* Left - Image (automatycznie dopasowany) */}
          <div className="relative h-[60vh] lg:h-[70vh] w-full">
            <Image
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=1200&fit=crop"
              alt="Featured sculpture"
              fill
              className="object-contain object-bottom" // object-contain + object-bottom
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
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
