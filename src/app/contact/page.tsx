import { Mail, Instagram } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
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

        {/* Additional Info */}
        <div className="text-center space-y-8 border-t border-gray-200 pt-16">
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

          <div className="pt-8">
            <p className="text-sm text-gray-500 italic">
              For general inquiries, please allow 2-3 business days for a
              response
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
