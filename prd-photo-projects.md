## Problem Statement

The portfolio website currently showcases only Piotr Goławski's fine art (sculptures, paintings, drawings). There is no place to publish travel and location-based photography, which is a separate body of creative work. Without a dedicated section, this work remains invisible to visitors of the site.

## Solution

Add a new **Photo Projects** section to the website. Photos are organised into **chapters** — each chapter is a named series tied to a location and date. Visitors browse chapters on a page that features an interactive Mapbox map (with clickable location markers) above a chapter grid. Clicking a chapter opens a full-screen photo gallery. A new admin section allows bulk-uploading photos into chapters with automatic Sharp optimisation on the server.

## User Stories

1. As a visitor, I want to see a "Photo Projects" link in the navigation, so that I can discover this section of the site.
2. As a visitor, I want to see an interactive map at the top of the Photo Projects page, so that I can visually understand where the photo series were taken.
3. As a visitor, I want to click a marker on the map and be taken to that chapter, so that I can browse photos from a specific place.
4. As a visitor, I want to see a grid of chapter cards below the map, so that I can browse all available photo series.
5. As a visitor, I want each chapter card to show a cover image, title, location name, and date, so that I can quickly decide which chapter interests me.
6. As a visitor, I want to click a chapter card and be taken to its gallery page, so that I can view all the photos in that series.
7. As a visitor, I want the chapter gallery to show photos in a 2-column grid (1 column on mobile) with consistent rectangular proportions, so that the layout feels clean and intentional.
8. As a visitor, I want to click a photo to open it in a fullscreen lightbox, so that I can see it at full resolution.
9. As a visitor, I want to navigate between photos in the lightbox using arrow buttons (or keyboard), so that I can move through the series without closing the lightbox.
10. As a visitor, I want the chapter URL to be human-readable (e.g. `/photo-projects/kazimierz-dolny-2024`), so that I can share a link that is legible and meaningful.
11. As a visitor, I want chapters to be listed chronologically by shoot date (newest first), so that the most recent work is prominent.
12. As an admin, I want a dedicated `/admin/photos` section separate from artwork management, so that the two types of content do not get mixed.
13. As an admin, I want to create a new chapter by entering a title, description, location name, geographic coordinates, and shoot date, so that all metadata for a series is captured in one place.
14. As an admin, I want the URL slug for a chapter to be generated automatically from its title, so that I do not have to type it manually.
15. As an admin, I want to bulk-upload multiple photos to a chapter in a single operation, so that adding a session of 20-50 photos is not tedious.
16. As an admin, I want uploaded photos to be automatically compressed and converted to WebP on the server, so that I do not need to run any scripts or prepare files beforehand.
17. As an admin, I want the first uploaded photo to automatically become the chapter cover image, so that the chapter grid always has a visual even if I do nothing extra.
18. As an admin, I want to click any photo in a chapter and set it as the cover image, so that I have full control over what appears in the chapter grid.
19. As an admin, I want to edit a chapter's title, description, location, coordinates, and shoot date after creation, so that I can correct or update metadata.
20. As an admin, I want to publish or unpublish a chapter, so that I can prepare content before it goes live.
21. As an admin, I want to delete individual photos from a chapter, so that I can remove unwanted shots after upload.
22. As an admin, I want to delete an entire chapter (and its photos), so that I can remove a series completely.

## Implementation Decisions

### Database schema (Supabase)

Two new tables:

**`photo_chapters`**
- `id` UUID PK
- `title` TEXT NOT NULL
- `slug` TEXT UNIQUE NOT NULL — auto-generated server-side from title (e.g. "Kazimierz Dolny 2024" becomes "kazimierz-dolny-2024"); stored in DB, never entered by user
- `description` TEXT
- `cover_image_url` TEXT
- `location` TEXT — human-readable place name (e.g. "Kazimierz Dolny")
- `latitude` NUMERIC
- `longitude` NUMERIC
- `shot_date` DATE NOT NULL — date the photos were taken (used for chronological ordering)
- `is_published` BOOLEAN DEFAULT false
- `created_at` TIMESTAMPTZ DEFAULT now()

**`photos`**
- `id` UUID PK
- `chapter_id` UUID FK to `photo_chapters.id` ON DELETE CASCADE
- `image_url` TEXT NOT NULL
- `storage_path` TEXT NOT NULL
- `is_published` BOOLEAN DEFAULT true
- `created_at` TIMESTAMPTZ DEFAULT now()

### Storage

New Supabase Storage bucket: `photos` (separate from `artworks`). Files stored under `photos/<chapter-id>/<filename>.webp`.

### Image optimisation

New upload API endpoint processes every image server-side with Sharp before writing to storage:
- Resize to max **3000px** width, preserving aspect ratio, no upscaling
- Convert to **WebP**, quality **85**
- Automatic and transparent — admin uploads original files and receives optimised WebP back

### Admin API routes

- `POST /api/admin/photos/chapters` — create chapter (generates slug server-side)
- `PATCH /api/admin/photos/chapters/[id]` — update chapter metadata
- `DELETE /api/admin/photos/chapters/[id]` — delete chapter + cascade photos
- `POST /api/admin/photos/upload` — bulk upload: accepts multiple files + chapter_id, runs Sharp optimisation, writes to storage, inserts `photos` rows, sets cover if chapter has none
- `PATCH /api/admin/photos/[id]/cover` — set a photo as chapter cover
- `DELETE /api/admin/photos/[id]` — delete single photo

All routes protected by the existing admin session cookie auth (`isAdminAuthenticated`).

### Data fetching

Two new React Query hooks (mirroring `useArtworks`):
- `usePhotoChapters()` — fetches published chapters ordered by `shot_date DESC`
- `useChapterPhotos(chapterId)` — fetches photos for a chapter ordered by `created_at ASC`

### `/photo-projects` page layout

1. **Mapbox map** (top, full-width) — style: monochrome/light; one marker per chapter that has coordinates; clicking a marker navigates to `/photo-projects/[slug]`. Library: `react-map-gl`.
2. **Chapter grid** (below map) — responsive CSS grid; chapter cards show cover image, title, location, and formatted shoot date.

### `/photo-projects/[slug]` page layout

- 2-column grid on desktop, 1 column on mobile
- Equal-width rectangles with a fixed aspect ratio container; images use `object-fit: cover`
- Clicking a photo opens a **lightbox**: fullscreen overlay, previous/next arrow navigation, close button; keyboard arrow keys and Escape supported

### Navigation

Add `{ href: "/photo-projects", label: "Photo Projects" }` to the links array in `Navigation.tsx`.

### `/admin/photos` page

- Chapter list view with create, edit, delete, publish/unpublish actions
- Chapter detail view: bulk file input (multiple), upload progress indicator, photo grid with "set as cover" and delete actions per photo
- Same visual style as existing `/admin` page

## Testing Decisions

The codebase currently has no automated tests. For this feature, the highest-value areas to test in isolation are:

- **Slug generation** — pure function mapping a chapter title to a URL-safe slug; simple unit test
- **Image optimisation utility** — function wrapping Sharp; can be tested with a fixture image and assertions on output format, dimensions, and file size ceiling

Both are deep modules: small interface, rich behaviour, no framework dependencies, easy to test without a browser or database.

## Out of Scope

- Fixing the existing `/api/admin/upload` endpoint (artworks) to apply Sharp optimisation — tracked as a follow-up (see Further Notes)
- Individual photo detail pages (`/photo-projects/[slug]/[photoId]`)
- A dedicated standalone map page
- Comments, likes, or any social features
- EXIF metadata extraction from uploaded photos

## Further Notes

### Follow-up: optimise artwork uploads

The current `/api/admin/upload` route (used by the artworks admin panel) uploads files to Supabase **without any compression** — it passes the raw buffer directly. The `optimize_and_upload.ts` CLI script correctly uses Sharp (WebP q80, max 2000px) but it is not wired into the browser-based admin flow.

A future task should update `/api/admin/upload` to apply the same Sharp pipeline used in the new photos upload route, so that all artwork images added via the admin panel are automatically optimised.
