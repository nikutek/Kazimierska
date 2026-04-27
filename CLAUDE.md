# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run lint             # Run ESLint
npm run import-artworks  # Bulk import artworks from Supabase storage
npm run optimize-upload  # Optimize images and upload to Supabase storage
```

## Architecture

**Artist portfolio for Piotr Goławski** — a Next.js 16 App Router application (TypeScript, React 19) backed by Supabase.

### Key directories

- `src/app/` — Next.js App Router pages: home, `/portfolio`, `/portfolio/[id]`, `/about`, `/contact`, `/admin`, `/kazimierska-oasis`
- `src/components/` — Shared components; `ui/` contains shadcn/ui primitives
- `src/hooks/` — React Query hooks (`useArtworks.ts`) for fetching artworks
- `src/lib/` — Supabase client (`supabase.ts`), DB queries (`queries.ts`), utilities
- `src/providers/` — `QueryProvider.tsx` wraps the app with React Query
- `types/database.ts` — `Artwork` and `ArtworkType` interfaces
- `scripts/` — One-off CLI scripts for importing and optimizing images

### Data flow

Artwork metadata lives in Supabase (`artworks` table). Images live in the `artworks` Supabase Storage bucket, organized by type (`sculpture/`, `painting/`, `drawing/`). Queries run through `src/lib/queries.ts` and are consumed via React Query hooks in `src/hooks/useArtworks.ts`.

### Styling

Tailwind CSS with shadcn/ui (New York style). CSS variables handle theming; dark mode is supported. Path alias `@/*` maps to `src/*`.

### Image handling

`next.config.ts` enables WebP/AVIF optimization and whitelists Supabase and Unsplash as remote image hosts. The `optimize-upload` script uses Sharp to resize/compress before upload.
