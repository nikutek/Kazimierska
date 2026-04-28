import { Mail, Instagram } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-32">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="font-serif text-5xl md:text-7xl mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            For inquiries about artworks, commissions, exhibitions, or
            collaborations
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-20">
          {/* Email */}
          <a
            href="mailto:pg.pasja@wp.pl"
            className="group border-2 border-gray-200 p-8 rounded-sm hover:border-black transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full group-hover:bg-black transition-colors duration-300">
                <Mail className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">
                  Email
                </p>
                <p className="text-lg group-hover:opacity-60 transition-opacity">
                  pg.pasja@wp.pl
                </p>
              </div>
            </div>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/golawski_goog"
            target="_blank"
            rel="noopener noreferrer"
            className="group border-2 border-gray-200 p-8 rounded-sm hover:border-black transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full group-hover:bg-black transition-colors duration-300">
                <Instagram className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">
                  Instagram
                </p>
                <p className="text-lg group-hover:opacity-60 transition-opacity">
                  @golawski_goog
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* Contact Form */}
        <div className="border-t border-gray-200 pt-16 max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl mb-10 text-center">
            Send a message
          </h2>
          <ContactForm />
        </div>

        {/* Additional Info */}
        <div className="text-center space-y-8 border-t border-gray-200 pt-16 mt-16">
          <div>
            <p className="text-sm tracking-wider uppercase text-gray-500 mb-2">
              Studio
            </p>
            <p className="text-lg text-gray-700">
              Kazimierska Oasis of Art
              <br />
              Bochotnica, Poland
            </p>
          </div>
        </div>
      </div>

      <div className="group fixed bottom-4 right-4 z-20 text-right">
        <p className="text-xs text-gray-500 tracking-wide">created by Nikodem Goławski</p>
        <div className="mt-1 space-y-1 opacity-0 translate-y-1 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
          <a
            href="mailto:n.golawski@gmail.com"
            className="block text-xs text-gray-600 hover:text-black"
          >
            n.golawski@gmail.com
          </a>
          <a
            href="https://github.com/nikutek"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-gray-600 hover:text-black"
          >
            github.com/nikutek
          </a>
        </div>
      </div>
    </main>
  );
}
