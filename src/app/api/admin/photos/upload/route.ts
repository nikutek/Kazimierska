import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import sharp from "sharp";

const VALID_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const chapterId = formData.get("chapter_id") as string | null;
  if (!chapterId) {
    return NextResponse.json({ error: "Brak chapter_id." }, { status: 400 });
  }

  const { data: chapter, error: chapterError } = await supabaseAdmin
    .from("photo_chapters")
    .select("id, cover_image_url")
    .eq("id", chapterId)
    .single();

  if (chapterError || !chapter) {
    return NextResponse.json({ error: "Chapter nie istnieje." }, { status: 404 });
  }

  const files = formData.getAll("files") as File[];
  if (files.length === 0) {
    return NextResponse.json({ error: "Brak plików." }, { status: 400 });
  }

  const results: { id: string; image_url: string }[] = [];
  const errors: string[] = [];
  let firstImageUrl: string | null = null;

  for (const file of files) {
    if (!VALID_MIME.includes(file.type)) {
      errors.push(`${file.name}: nieobsługiwany format (${file.type})`);
      continue;
    }

    try {
      const buffer = Buffer.from(await file.arrayBuffer());

      const optimized = await sharp(buffer)
        .resize(3000, null, { withoutEnlargement: true, fit: "inside" })
        .webp({ quality: 85 })
        .toBuffer();

      const baseName = file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 60);
      const storagePath = `${chapterId}/${baseName}_${Date.now()}.webp`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("photos")
        .upload(storagePath, optimized, {
          contentType: "image/webp",
          upsert: false,
        });

      if (uploadError) {
        errors.push(`${file.name}: ${uploadError.message}`);
        continue;
      }

      const { data: urlData } = supabaseAdmin.storage
        .from("photos")
        .getPublicUrl(storagePath);

      const { data: photo, error: dbError } = await supabaseAdmin
        .from("photos")
        .insert({
          chapter_id: chapterId,
          image_url: urlData.publicUrl,
          storage_path: storagePath,
          is_published: true,
        })
        .select("id, image_url")
        .single();

      if (dbError) {
        errors.push(`${file.name}: ${dbError.message}`);
        continue;
      }

      results.push(photo);
      if (!firstImageUrl) firstImageUrl = urlData.publicUrl;
    } catch (err) {
      errors.push(`${file.name}: nieoczekiwany błąd`);
      console.error(err);
    }
  }

  // Auto-set cover if chapter has none
  if (!chapter.cover_image_url && firstImageUrl) {
    await supabaseAdmin
      .from("photo_chapters")
      .update({ cover_image_url: firstImageUrl })
      .eq("id", chapterId);
  }

  return NextResponse.json({
    success: true,
    uploaded: results.length,
    errors,
    photos: results,
  });
}
