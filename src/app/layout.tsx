import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import QueryProvider from "@/providers/QueryProvider";

const serif = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Piotr Goławski – Polish Sculptor | Contemporary Sculpture, Painting & Drawing",
    template: "%s | Piotr Goławski",
  },
  description:
    "Piotr Goławski is a Polish visual artist and sculptor whose work explores the human condition through form, texture, and silence. Browse original sculptures, paintings, and drawings. Available internationally.",
  metadataBase: new URL("https://www.kazimierska.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://www.kazimierska.com",
    siteName: "Piotr Goławski – Sculptor",
    title: "Piotr Goławski – Polish Sculptor & Visual Artist",
    description:
      "Contemporary sculptures, paintings and drawings by Polish artist Piotr Goławski. Exploring the human condition through form, silence, and material.",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg", // dodaj zdjęcie 1200x630px
        width: 1200,
        height: 630,
        alt: "Piotr Goławski – Polish Sculptor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Piotr Goławski – Polish Sculptor",
    description:
      "Contemporary sculpture and visual art exploring the human condition. Original works available internationally.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "Piotr Goławski",
    "Polish sculptor",
    "contemporary sculpture",
    "figurative art",
    "original sculpture for sale",
    "Polish fine art",
    "visual artist Poland",
    "Kazimierz Dolny artist",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <QueryProvider>
          <Navigation />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}