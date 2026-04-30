import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Artwork } from "../../../../../types/database";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: Partial<Artwork>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = payload.title?.trim();
  const imageUrl = payload.image_url?.trim();
  const storagePath = payload.storage_path?.trim();
  const type = payload.type;

  if (!title || !imageUrl || !storagePath || !type) {
    return NextResponse.json(
      { error: "Missing required fields: title, type, image_url, storage_path." },
      { status: 400 },
    );
  }

  const normalizedPayload = {
    title,
    description: payload.description ?? null,
    type,
    image_url: imageUrl,
    storage_path: storagePath,
    year: payload.year ?? null,
    price: payload.price ?? null,
    is_sold: payload.is_sold ?? false,
    is_published: payload.is_published ?? true,
    order_index: payload.order_index ?? 0,
    dimensions: payload.dimensions ?? null,
    material: payload.material ?? null,
    technique: payload.technique ?? null,
  };

  const { data, error } = await supabaseAdmin
    .from("artworks")
    .insert(normalizedPayload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, artwork: data });
}
