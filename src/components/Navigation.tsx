"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/portfolio", label: "Portfolio" },
    { href: "/about", label: "About Me" },
    { href: "/kazimierska-oasis", label: "Kazimierska Oasis of Art" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-2xl md:text-3xl tracking-wide hover:opacity-70 transition-opacity"
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

          {/* Mobile menu button - TODO: dodamy później */}
          <button className="md:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
