"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Zamknij menu gdy zmieni się ścieżka
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Zablokuj scroll gdy menu otwarte
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const links = [
    { href: "/portfolio", label: "Portfolio" },
    { href: "/about", label: "About Me" },
    { href: "/kazimierska-oasis", label: "Kazimierska Oasis of Art" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="font-serif text-2xl md:text-3xl tracking-wide hover:opacity-70 transition-opacity relative z-50"
            >
              Piotr Goławski
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wider uppercase transition-opacity hover:opacity-60 ${
                    pathname === link.href
                      ? "opacity-100 font-medium"
                      : "opacity-70"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative z-50 p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu - Full screen */}
      <div
        className={`fixed inset-0 bg-white z-[60] md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Logo w menu mobilnym */}
        <div className="absolute top-0 left-0 right-0 px-6 h-20 flex items-center border-b border-gray-200">
          <Link
            href="/"
            className="font-serif text-2xl tracking-wide hover:opacity-70 transition-opacity"
          >
            Piotr Goławski
          </Link>
        </div>

        {/* Menu content - centered */}
        <div className="flex flex-col items-center justify-center h-full space-y-8 px-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-3xl font-serif tracking-wide transition-opacity hover:opacity-60 ${
                pathname === link.href
                  ? "opacity-100 font-medium"
                  : "opacity-70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
