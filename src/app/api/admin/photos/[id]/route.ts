import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: photo, error: fetchError } = await supabaseAdmin
    .from("photos")
    .select("storage_path, chapter_id, image_url")
    .eq("id", id)
    .single();

  if (fetchError || !photo) {
    return NextResponse.json({ error: "Zdjęcie nie istnieje." }, { status: 404 });
  }

  await supabaseAdmin.storage.from("photos").remove([photo.storage_path]);

  const { error: dbError } = await supabaseAdmin
    .from("photos")
    .delete()
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // If this was the cover, clear it
  await supabaseAdmin
    .from("photo_chapters")
    .update({ cover_image_url: null })
    .eq("id", photo.chapter_id)
    .eq("cover_image_url", photo.image_url);

  return NextResponse.json({ success: true });
}
