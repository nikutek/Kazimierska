import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const VALID_TYPES = ["sculpture", "painting", "drawing"] as const;
const VALID_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

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

  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string | null;

  if (!file) {
    return NextResponse.json({ error: "Brak pliku." }, { status: 400 });
  }
  if (!type || !VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    return NextResponse.json({ error: "Nieprawidłowy typ dzieła." }, { status: 400 });
  }
  if (!VALID_MIME.includes(file.type)) {
    return NextResponse.json(
      { error: `Nieobsługiwany format pliku: ${file.type}` },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const baseName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 60);
  const filename = `${baseName}_${Date.now()}.${ext}`;
  const storagePath = `${type}/${filename}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from("artworks")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabaseAdmin.storage
    .from("artworks")
    .getPublicUrl(storagePath);

  return NextResponse.json({ image_url: urlData.publicUrl, storage_path: storagePath });
}
