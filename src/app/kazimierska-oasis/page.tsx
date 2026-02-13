import Image from "next/image";

export default function KazimierskaOasisPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Full height intro */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/kazimierz-dolny-z-lotu-ptaka-9.jpg"
            alt="Kazimierska Oasis of Art"
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight text-white">
            Kazimierska
            <br />
            Oasis of Art
          </h1>
          <p className="text-xl md:text-2xl text-white/90 italic">
            A place of silence, creation, and contemplation
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-white/80 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/80 rounded-full" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20 space-y-32">
        {/* Introduction */}
        <section className="prose prose-lg lg:prose-xl max-w-none">
          <p className="text-xl md:text-2xl leading-relaxed text-gray-700 font-serif italic">
            The Kazimierska Oasis of Art is born from a longing for silence.
          </p>

          <div className="mt-12 space-y-6 text-gray-700 leading-relaxed">
            <p>
              From the need to step away from noise, from glances, from rhythms
              that do not belong to the creator. It is my place — raw, still in
              renovation, yet already filled with an inner light.
            </p>

            <p>
              A studio where matter listens, and thought is given space to
              settle slowly, like dust on the surface of a work.
            </p>
          </div>
        </section>

        {/* Image placeholder - dodaj zdjęcia jak będą */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-[4/5] bg-gray-100 rounded-sm relative overflow-hidden">
            {/* <Image src="..." alt="Studio exterior" fill className="object-cover" /> */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              [Studio exterior]
            </div>
          </div>
          <div className="aspect-[4/5] bg-gray-100 rounded-sm relative overflow-hidden">
            {/* <Image src="..." alt="Work in progress" fill className="object-cover" /> */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              [Work in progress]
            </div>
          </div>
        </section>

        {/* Kazimierz Dolny Context */}
        <section className="space-y-8">
          <h2 className="font-serif text-4xl md:text-5xl">The Place</h2>

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700 leading-relaxed">
            <p>
              Kazimierz Dolny — for ages the Polish mecca of artists — gives
              this place its meaning. Its history radiates outward and enters
              the Oasis like a quiet conversation.
            </p>

            <p>
              The Vistula, flowing here for centuries, has "built" Kazimierz and
              taught humility toward time. The ravines remind us that the true
              path often leads inward, not outward.
            </p>
          </div>

          {/* Stats/Info boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 not-prose">
            <div className="border-l-2 border-gray-200 pl-6">
              <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">
                Location
              </p>
              <p className="text-lg">Bochotnica, near Kazimierz Dolny</p>
            </div>
            <div className="border-l-2 border-gray-200 pl-6">
              <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">
                Established
              </p>
              <p className="text-lg">Ongoing since 2019</p>
            </div>
            <div className="border-l-2 border-gray-200 pl-6">
              <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">
                Purpose
              </p>
              <p className="text-lg">Creative studio & gathering space</p>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="bg-gray-50 -mx-6 lg:-mx-8 px-6 lg:px-8 py-16 rounded-lg">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl text-center">
              A Space for Contemplation
            </h2>

            <div className="prose prose-lg max-w-none space-y-6 text-gray-700 leading-relaxed">
              <p>
                The Oasis is a place of encounters, though not with the outside
                world — but with one's own silence. A state of withdrawal, a
                private refuge where the creator seeks balance between the world
                and contemplation.
              </p>

              <p>
                A space where gesture returns to tradition, and form is born
                from attentiveness, focus, and respect for the place.
              </p>

              <p className="font-serif text-xl italic text-center pt-6">
                Here, sculpture becomes a trace of presence.
                <br />A quiet record of what matters most.
              </p>
            </div>
          </div>
        </section>

        {/* Activities */}
        <section className="space-y-12">
          <h2 className="font-serif text-4xl md:text-5xl">Activities</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ActivityCard
              title="Artist Residencies"
              description="The Oasis hosts plein-air sessions and artistic gatherings, providing space for focused creative work in a contemplative environment."
            />
            <ActivityCard
              title="Art Five Meetings"
              description="Regular meetings of the Art Five group—a collective of artists exploring form, matter, and the creative process."
            />
            <ActivityCard
              title="Workshops"
              description="Occasional workshops connecting traditional craft techniques with contemporary artistic practice."
            />
            <ActivityCard
              title="Private Reflection"
              description="Primarily, the Oasis serves as a personal studio—a sanctuary for deep work and artistic exploration."
            />
          </div>
        </section>

        {/* Image gallery - panoramic */}
        <section className="space-y-8">
          <h2 className="font-serif text-4xl md:text-5xl">The Space</h2>

          <div className="aspect-[16/9] bg-gray-100 rounded-sm relative overflow-hidden">
            {/* <Image src="..." alt="Panoramic view" fill className="object-cover" /> */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              [Panoramic view of the studio]
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gray-100 rounded-sm relative overflow-hidden"
              >
                {/* <Image src="..." alt={`Detail ${i}`} fill className="object-cover" /> */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  [Detail {i}]
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Connection to history */}
        <section className="border-t border-gray-200 pt-16 space-y-8">
          <h2 className="font-serif text-4xl md:text-5xl">
            Rooted in Tradition
          </h2>

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700 leading-relaxed">
            <p>
              The place connects the memory of labor on the land with the
              essence of artistic creation—a process that also requires effort
              and patience.
            </p>

            <p>
              Built on the grounds of a former farm, the Oasis honors the land's
              history while transforming it into a space dedicated to
              contemporary art-making. The physical work of renovation mirrors
              the patient, deliberate process of sculpture itself.
            </p>

            <p>
              Still evolving, still becoming—the Oasis remains a work in
              progress, much like the art created within its walls.
            </p>
          </div>
        </section>

        {/* Final quote */}
        <section className="text-center py-16">
          <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl italic text-gray-600 leading-tight max-w-4xl mx-auto">
            &ldquo;A studio where matter listens, and thought is given space to
            settle slowly, like dust on the surface of a work.&rdquo;
          </blockquote>
        </section>
      </div>
    </main>
  );
}

// Helper Component
function ActivityCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-l-2 border-gray-200 pl-6 py-4">
      <h3 className="font-serif text-2xl mb-3">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
}
