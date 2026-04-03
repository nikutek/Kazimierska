"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("bio");
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Nawigacja sekcji
      const sections = [
        "bio",
        "exhibitions",
        "projects",
        "publications",
        "research",
      ];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }

      // Ukrywanie/pokazywanie nawigacji
      if (currentScrollY < 100) {
        // Zawsze pokazuj na samej górze
        setIsNavVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scroll w górę - pokaż
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scroll w dół - ukryj
        setIsNavVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        {/* Header */}
        <div className="mb-20 text-center">
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            Piotr Goławski
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Sculptor & Visual Artist
          </p>
        </div>

        {/* Sticky Navigation z animacją */}
        <nav
          className={`sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 mb-16 -mx-6 px-6 lg:-mx-8 lg:px-8 transition-transform duration-300 ${
            isNavVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {/* Mobile & Tablet - Segmented control */}
          <div className="lg:hidden py-4">
            <div className="bg-gray-100 rounded-lg p-1 space-y-1">
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: "bio", label: "Bio" },
                  { id: "exhibitions", label: "Exhibitions" },
                  { id: "projects", label: "Projects" },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`py-2 px-2 rounded-md text-xs tracking-wider uppercase transition-all ${
                      activeSection === section.id
                        ? "bg-white shadow-sm font-medium"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { id: "publications", label: "Publications" },
                  { id: "research", label: "Research" },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`py-2 px-2 rounded-md text-xs tracking-wider uppercase transition-all ${
                      activeSection === section.id
                        ? "bg-white shadow-sm font-medium"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop - Original buttons */}
          <div className="hidden lg:flex justify-center gap-8 py-4">
            {[
              { id: "bio", label: "Bio" },
              { id: "exhibitions", label: "Exhibitions" },
              { id: "projects", label: "Projects" },
              { id: "publications", label: "Publications" },
              { id: "research", label: "Research" },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`text-sm tracking-wider uppercase whitespace-nowrap transition-opacity ${
                  activeSection === section.id
                    ? "opacity-100 font-medium border-b-2 border-black"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-32">
          {/* BIO SECTION */}
          <section id="bio" className="scroll-mt-32">
            <h2 className="font-serif text-4xl mb-8">About</h2>

            <div className="prose prose-lg max-w-none space-y-6 text-gray-700 leading-relaxed">

              <p>
                Piotr Goławski is a sculptor and visual artist whose work explores the human condition through form, material, and silence. His creative practice spans sculpture, painting, and drawing, with a particular focus on how matter itself can become a carrier of inner narratives and emotion.
              </p>

              <p>
                A graduate of the Academy of Fine Arts in Warsaw (Painting & Drawing, Open Academy, 2020), Goławski’s work is characterized by a contemplative approach to materials—especially clay subjected to raku firing—where cracks, burns, and surface textures become visual records of human experience. 
              </p>

              <p>
                His work has been presented internationally, with his physical presence on the global art scene gradually unfolding during Miami Art Week 2025 (Spectrum Miami), following earlier online representation on platforms such as Saatchi Art.  Beyond his studio practice, he is engaged in artistic projects of a social and therapeutic nature, including regular workshops for children and young people, also those with disabilities.
              </p>

              <p>
              His work extends into the exploration of the relationship between art and its environment through ongoing artistic research projects such as “Thought Written in Sculptural Form” (Zapisana w formie myśl–rzeźba) and “In the Suspended State of Human Matter – A Study” (W zawieszenia stanie materii ludzkiej studium).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 not-prose">
                <div>
                  <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">
                    Lives & Works
                  </p>
                  <p className="text-lg">Siedlce & Bochotnica, Poland</p>
                </div>
                <div>
                  <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">
                    Education
                  </p>
                  <p className="text-lg">
                    Academy of Fine Arts, Warsaw
                    <br />
                    Painting & Drawing, 2020
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* EXHIBITIONS SECTION */}
          <section id="exhibitions" className="scroll-mt-32">
            <h2 className="font-serif text-4xl mb-12">Exhibitions</h2>

            <div className="space-y-16">
              <YearGroup year="2026">
                <ExhibitionItem title="Art Expo New York 2026"
                location="Pier 36, New York City"
                description="Presented with ORAC Gallery"
                isArtFair
                /><ExhibitionItem title="Painted"
                location="Terminal Kultury Gocław, Warsaw"
                description="group exhibition of members of the Mazovian District of the Związek Artystów Plastyków"
                />
              </YearGroup>

              {/* 2025 */}
              <YearGroup year="2025">
                <ExhibitionItem
                  title="Miami Art Week 2025"
                  location="Mana Wynwood Convention Center, Miami"
                  description="presented with Plogix Gallery"
                  isArtFair
                />

                <ExhibitionItem
                  title="International Painting Residency 'Signs of Kazimierz III'"
                  location="Kazimierz Dolny, Poland"
                  description="Outdoor exhibition on the town square. Organizer: ZAP."
                />
                <ExhibitionItem
                  title="Post-Residency exhibition"
                  location="Dworek Miętne, Poland"
                  description="Society of Maciejowice Enthusiasts"
                  isGroup
                />
                <ExhibitionItem
                  title="By the Okrzejka and the Vistula – Historical Landscapes"
                  location="Miętne, Poland"
                  description="International Painting Residency. Organizers: Society of Friends of Maciejowice & Polish Kościuszko Foundation."
                  isGroup
                />
                <ExhibitionItem
                  title="28th GRELOWISKO – Art Five and Friends"
                  location="Reymontówka, Chlewiska, Poland"
                  isGroup
                />
                <ExhibitionItem
                  title="International Painting & Sculpture Residency 'Reymontowska Sonata'"
                  location="Reymontówka Chlewiska, Poland"
                />
                <ExhibitionItem
                  title="The Meanders of Art – Art Five"
                  location="Regional Museum in Łuków, Poland"
                  description="Temporary exhibition for the Night of Museums"
                  isGroup
                />
              </YearGroup>

              {/* 2024 */}
              <YearGroup year="2024">
                <ExhibitionItem
                  title="7th Heaven of Femininity"
                  location="Parisel Palace Zacisze Leśne, Poland"
                  isGroup
                />
                <ExhibitionItem
                  title="Signs of Kazimierz"
                  location="Kazimierz Dolny, Poland"
                  description="Residency of artists of ZAP OM"
                />
                <ExhibitionItem
                  title="Dwa Brzegi 15 – Art Channel"
                  location="Kazimierz Dolny, Poland"
                  description="Kazimierska Konfraternia Sztuki – artist colony and guests"
                  isGroup
                />
                <ExhibitionItem
                  title="What Connects Us"
                  location="Fabryczka Cultural Center, Wołomin, Poland"
                  isGroup
                />
                <ExhibitionItem
                  title="Students from the Łuków Center and Their Friends – Greluk & Goławski"
                  location="Regional Museum in Łuków, Poland"
                  description="Co-leading art workshops under the patronage of the Łuków County"
                />
                <ExhibitionItem
                  title="Kazimierz Dolny"
                  location="'Communio Graphis' Gallery, Góra Kalwaria, Poland"
                  description="Post-Residency group exhibition"
                  isGroup
                />
                <ExhibitionItem
                  title="Oddities of Different Personalities"
                  location="Elektrownia Powiśle, Warsaw, Poland"
                  description="Izabela Mroczkowska / Piotr Goławski. Under the patronage of Elektrownia Powiśle and ZAP OM"
                />
              </YearGroup>

              {/* 2023 */}
              <YearGroup year="2023">
                <ExhibitionItem
                  title="The Interpretation of Important Thoughts"
                  location="Elektrownia Powiśle, Warsaw, Poland"
                  description="Solo exhibition under the patronage of Elektrownia Powiśle and ZAP OM"
                  isSolo
                />
                <ExhibitionItem
                  title="Art as Therapy"
                  location="Elektrownia Powiśle, Warsaw, Poland"
                  description="Solo exhibition under the patronage of Elektrownia Powiśle"
                  isSolo
                />
                <ExhibitionItem
                  title="Residency in Kazimierz Dolny"
                  location="Kazimierz Dolny, Poland"
                  description="Organizer: ZAP OM"
                />
                <ExhibitionItem
                  title="Polish Landscape"
                  location="National Museum branch in Uzarzewo, Poland"
                  description="Group exhibition of ZAP members"
                  isGroup
                />
                <ExhibitionItem
                  title="In Time and Space"
                  location="'Pod Okiem' Gallery, Warsaw, Poland"
                  description="Group exhibition of the 'Jak w korcu maku' collective"
                  isGroup
                />
              </YearGroup>

              {/* 2022 */}
              <YearGroup year="2022">
                <ExhibitionItem
                  title="Polish Landscape"
                  location="Pasaż Gallery, Mysiadło, Poland"
                  description="Group exhibition of ZAP OM"
                  isGroup
                />
                <ExhibitionItem
                  title="Tomorrow Already"
                  location="Elektrownia Powiśle, Warsaw, Poland"
                  description="Solo exhibition under the patronage of Elektrownia Powiśle and ZAP OM"
                  isSolo
                />
                <ExhibitionItem
                  title="Our Land"
                  location="Fabryczka Cultural Center, Wołomin, Poland"
                  description="Group exhibition of ZAP"
                  isGroup
                />
                <ExhibitionItem
                  title="We Here and Now"
                  location="Center for Culture and Art, Siedlce, Poland"
                  description="Solo exhibition summarizing a decade of work"
                  isSolo
                />
                <ExhibitionItem
                  title="Polish Landscape"
                  location="Intergenerational Education Center, Wilanów, Warsaw, Poland"
                  isGroup
                />
                <ExhibitionItem
                  title="International Painting Residency 'The Beauty of the Liwiec Valley'"
                  location="Reymontówka, Chlewiska, Poland"
                />
                <ExhibitionItem
                  title="On the Way to the Future"
                  location="Gepetto Art Space, Warsaw, Poland"
                  isSolo
                />
                <ExhibitionItem
                  title="Graphics, photography and painting exhibition – FOKS art project"
                  location="Śródmieście Cultural Center, 'Na Smolnej' Gallery, Warsaw, Poland"
                  isGroup
                />
                <ExhibitionItem
                  title="Painted with Water"
                  location="Elektrownia Powiśle, Warsaw, Poland"
                  isGroup
                />
                <ExhibitionItem
                  title="Author's Evening"
                  location="Elektrownia Powiśle, Warsaw, Poland"
                  description="Meeting with Piotr Goławski under the patronage of ZAP OM and Elektrownia Powiśle"
                />
                <ExhibitionItem
                  title="Feminine Worldspaces 2022"
                  location="BWA Okno, Lesznowola, Poland"
                  isGroup
                />
                <ExhibitionItem
                  title="Another Existence"
                  location="Elektrownia Powiśle, Warsaw, Poland"
                  isSolo
                />
                <ExhibitionItem
                  title="From Passion"
                  location="Elektrownia Powiśle, Warsaw, Poland"
                  description="ZAP group exhibition"
                  isGroup
                />
              </YearGroup>

              {/* 2021 */}
              <YearGroup year="2021">
                <ExhibitionItem
                  title="Thoughts and Feelings"
                  location="Cultural Center in Wilanów, Warsaw, Poland"
                  description="ZAP exhibition"
                  isGroup
                />
                <ExhibitionItem
                  title="ZAP painting Residency"
                  location="Dłużew, Poland"
                />
                <ExhibitionItem
                  title="Woman"
                  location="Poznań, Poland"
                  description="ZAP exhibition"
                  isGroup
                />
                <ExhibitionItem
                  title="International Biennale Quadro Art"
                  location="Virtual gallery"
                  isGroup
                />
                <ExhibitionItem
                  title="Bielska Jesień Biennale 2021"
                  location="Virtual gallery"
                  isGroup
                />
                <ExhibitionItem
                  title="We Are"
                  location="Elektrownia Powiśle, Warsaw, Poland"
                  description="ZAP OM exhibition"
                  isGroup
                />
                <ExhibitionItem
                  title="Historic Architecture of the Wielopolski Estates"
                  location="Śrem Museum, Poland"
                  description="ZAP exhibition"
                  isGroup
                />
                <ExhibitionItem
                  title="Small Dreams in Large Spaces"
                  location="Fabryczka Gallery, Wołomin, Poland"
                />
                <ExhibitionItem
                  title="She and He"
                  location="DK 'Polan Sto', Poznań, Poland"
                  description="Painting & photography exhibition"
                />
                <ExhibitionItem
                  title="Feminine Worldspaces 2021"
                  location="BWA Okno, Lesznowola, Poland"
                  isGroup
                />
              </YearGroup>

              {/* 2020 */}
              <YearGroup year="2020">
                <ExhibitionItem
                  title="Relations"
                  location="Warsaw Workshop, Poland"
                  isGroup
                />
                <ExhibitionItem
                  title="Group exhibition 'Jak w korcu maku'"
                  location="Warsaw Workshop, Poland"
                  isGroup
                />
              </YearGroup>

              {/* 2019 */}
              <YearGroup year="2019">
                <ExhibitionItem
                  title="ASP painting Residency"
                  location="Dłużew, Poland"
                />
                <ExhibitionItem
                  title="Solo exhibition"
                  location="Center for Culture and Art, Siedlce, Poland"
                  isSolo
                />
                <ExhibitionItem
                  title="Solo exhibition"
                  location="Correctional Facility in Siedlce, Poland"
                  description="Art-based rehabilitation & education project"
                  isSolo
                />
              </YearGroup>

              {/* 2017 */}
              <YearGroup year="2017">
                <ExhibitionItem
                  title="Urban plein-air painting"
                  location="Allées Paul Riquet, Béziers, France"
                />
              </YearGroup>

              {/* Planned - 2119 */}
              <div className="border-t-2 border-gray-300 pt-12">
                <h3 className="text-sm tracking-wider uppercase text-gray-500 mb-8">
                  Planned
                </h3>
                <YearGroup year="2119">
                  <ExhibitionItem
                    title="Opening of the time capsule 'What Will Remain After Us'"
                    location="Regional Museum in Siedlce, Poland"
                    description="Solo exhibition connected to the opening of the time capsule (2019–2119)"
                    isSolo
                  />
                </YearGroup>
              </div>
            </div>
          </section>

          {/* PROJECTS SECTION */}
          <section id="projects" className="scroll-mt-32">
            <h2 className="font-serif text-4xl mb-12">Projects</h2>

            <div className="space-y-12">
              <ProjectItem
                year="2019–2119"
                title="What Will Remain After Us"
                description="A time-capsule project initiated by the Mayor of Siedlce Commune, created in collaboration with the Royal Castle in Warsaw and the School in Stok Lacki. The capsule, sealed for 100 years, contains Piotr Goławski's drawings and handwritten inscriptions by individuals significant for the Mazovia region. The project carries a symbolic dimension of 'resurrection' and inaugurates a cycle of similar artistic-social actions to be repeated every century."
              />

              <ProjectItem
                year="Ongoing"
                title="Creative Work House in Bochotnica (Kazimierska)"
                description="Piotr Goławski is developing an independent creative center on the grounds of a former farm near Kazimierz Dolny. The place connects the memory of labor on the land with the essence of artistic creation—a process that also requires effort and patience. It hosts plein-air sessions and artistic meetings, including gatherings of the Art Five group."
                link="/kazimierska-oasis"
              />

              <ProjectItem
                year="Ongoing"
                title="Cyclical therapeutic workshops at the Educational Center in Łuków"
                description="Together with his artistic brother Mirosław Greluk, Piotr Goławski conducts creative workshops for children and young people with disabilities. For this activity, both artists were awarded the honorary title 'Friend of the School.'"
              />

              <ProjectItem
                year="2019"
                title="Our Friendly City"
                description="An artistic scholarship project of the Mayor of Siedlce. Around thirty of the artist's drawings depict his hometown 'through a distorted mirror', accompanied by over one hundred handwritten inscriptions by key regional figures: the mayor, commune leaders, bishops, the university rector, politicians, business representatives, local authorities, the police and fire services. The result is a lasting, meaningful artistic and social record for the region."
              />

              <ProjectItem
                year="Ongoing"
                title="Cooperation in social and therapeutic projects"
                description="Including support for the 'Seventh Heaven of Femininity' initiative and creative work with children with disabilities and their caregivers."
              />
            </div>

            {/* Awards & Honors */}
            <div className="mt-16 pt-12 border-t border-gray-200">
              <h3 className="font-serif text-2xl mb-8">Awards & Honors</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-700">Title of School Friend</span>
                  <span className="text-sm text-gray-500">2024</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-700">
                    Artistic Scholarship of the Mayor of Siedlce
                  </span>
                  <span className="text-sm text-gray-500">2022</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-700">
                    Artistic scholarship "Our Friendly City"
                  </span>
                  <span className="text-sm text-gray-500">2019</span>
                </div>
              </div>
            </div>
          </section>

          {/* PUBLICATIONS SECTION */}
          <section id="publications" className="scroll-mt-32">
            <h2 className="font-serif text-4xl mb-12">Publications</h2>

            <div className="space-y-8">
              <PublicationItem
                year="2025"
                title="ART FIVE 2025"
                type="Catalog"
                isbn="978-83-936902-3-7"
              />

              <PublicationItem
                year="2022"
                title="ZWIĄZEK ARTYSTÓW PLASTYKÓW O.M. 2022"
                type="Catalog"
                isbn="978-83-957038-3-6"
              />

              <PublicationItem
                year="2020"
                title="AKADEMIA SZTUK PIĘKNYCH W WARSZAWIE, DOROŚLI DO SZTUKI 2020"
                type="Catalog"
                isbn="978-83-66098-86-2"
              />

              <PublicationItem
                year="2020"
                title="ZWIĄZEK ARTYSTÓW PLASTYKÓW O.M. 2020"
                type="Catalog"
                isbn="978-83-957038-2-9"
              />

              <PublicationItem
                year="2019"
                title="AKADEMIA SZTUK PIĘKNYCH W WARSZAWIE, DOROŚLI DO SZTUKI, PLENERY 2019"
                type="Catalog"
                isbn="978-83-66098-55-8"
              />
            </div>
          </section>

          {/* RESEARCH SECTION */}
          <section id="research" className="scroll-mt-32">
            <h2 className="font-serif text-4xl mb-12">Research</h2>

            <div className="space-y-16">
              <ResearchItem
                year="2025"
                title="Silence Embedded in Form: A Study of Sculptural Matter as a Carrier of Inner Narratives"
                description="This research explores sculpture as a medium capable of conveying emotion and meaning through silence, texture, and the physical memory of material. Special attention is given to surfaces marked by cracks, burns, and the traces of the raku firing process—treated as a visual record of human experience. The project examines how the sculptural object becomes a space of dialogue between creator and viewer, and how the contemplative encounter with form may lead to a form of catharsis for both. The study highlights the role of imperfection as a bearer of truth and investigates silence as the fundamental language of sculptural expression."
              />

              <ResearchItem
                year="2025"
                title="In the Suspended State of Human Matter – a Study"
                description="This project investigates the creative process that unfolds in situations of physical stillness and psychological detachment from everyday reality—specifically during a long-distance intercontinental flight. Drawing conducted in this liminal, in-between state is approached as a form of trance, introspection, and heightened awareness, where the mind operates outside its habitual rhythm. The study focuses on how transit alters perception, gesture, and compositional decision-making, revealing how a moment of suspension—seemingly passive—opens a unique space for intensified creation and deepened self-reflection."
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

// Helper Components

function YearGroup({
  year,
  children,
}: {
  year: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-2xl font-serif mb-6 text-gray-900">{year}</h3>
      <div className="space-y-6 pl-6 border-l-2 border-gray-200">
        {children}
      </div>
    </div>
  );
}

function ExhibitionItem({
  title,
  location,
  description,
  isSolo = false,
  isGroup = false,
  isArtFair = false,
}: {
  title: string;
  location: string;
  description?: string;
  isSolo?: boolean;
  isGroup?: boolean;
  isArtFair?: boolean;
}) {
  return (
    <div className="pl-6">
      <div className="flex flex-wrap items-baseline gap-2 mb-2">
        {isArtFair && (
          <span className="text-xs tracking-wider uppercase text-white bg-black px-2 py-1 rounded">
            Art Fair
          </span>
        )}
        {isSolo && (
          <span className="text-xs tracking-wider uppercase text-black bg-gray-400 px-2 py-1 rounded">
            Solo
          </span>
        )}
        {isGroup && (
          <span className="text-xs tracking-wider uppercase text-gray-600 bg-gray-100 px-2 py-1 rounded">
            Group
          </span>
        )}
      </div>
      <h4 className="font-medium text-lg mb-1">{title}</h4>
      <p className="text-gray-600 text-sm mb-2">{location}</p>
      {description && (
        <p className="text-gray-700 leading-relaxed text-sm">{description}</p>
      )}
    </div>
  );
}

function ProjectItem({
  year,
  title,
  description,
  link,
}: {
  year: string;
  title: string;
  description: string;
  link?: string;
}) {
  return (
    <div className="border-l-2 border-gray-200 pl-6">
      <p className="text-sm font-medium text-gray-500 mb-2">{year}</p>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-serif text-2xl mb-3">{title}</h4>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>
        {link && (
          <a
            href={link}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
}

function PublicationItem({
  year,
  title,
  type,
  isbn,
  link,
}: {
  year: string;
  title: string;
  type: string;
  isbn?: string;
  link?: string;
}) {
  return (
    <div className="border-l-2 border-gray-200 pl-6">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-sm font-medium text-gray-500">{year}</span>
        <span className="text-xs tracking-wider uppercase text-gray-500">
          {type}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-medium text-lg mb-1">{title}</h4>
          {isbn && <p className="text-sm text-gray-600">ISBN {isbn}</p>}
        </div>
        {link && (
          <a
            href={link}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
}

function ResearchItem({
  year,
  title,
  description,
}: {
  year: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-l-2 border-gray-200 pl-6">
      <p className="text-sm font-medium text-gray-500 mb-3">{year}</p>
      <h4 className="font-serif text-2xl mb-4 leading-tight">{title}</h4>
      <p className="text-gray-700 leading-relaxed">{description}</p>
      <p className="text-sm text-gray-500 italic mt-4">Piotr Goławski {year}</p>
    </div>
  );
}
