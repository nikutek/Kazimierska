import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: photo, error: fetchError } = await supabaseAdmin
    .from("photos")
    .select("chapter_id, image_url")
    .eq("id", id)
    .single();

  if (fetchError || !photo) {
    return NextResponse.json({ error: "Zdjęcie nie istnieje." }, { status: 404 });
  }

  const { error } = await supabaseAdmin
    .from("photo_chapters")
    .update({ cover_image_url: photo.image_url })
    .eq("id", photo.chapter_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
