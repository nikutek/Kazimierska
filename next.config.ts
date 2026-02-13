import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "alatkoasrrsqddjsabif.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Dodaj konfigurację optymalizacji
    formats: ["image/webp", "image/avif"], // Nowoczesne formaty
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Thumbnails
    minimumCacheTTL: 60 * 60 * 24 * 30, // Cache przez 30 dni
  },
};

export default nextConfig;
