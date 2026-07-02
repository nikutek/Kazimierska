import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateSlug } from "@/lib/slug";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("photo_chapters")
    .select("*")
    .order("shot_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ chapters: data });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = (body.title as string | undefined)?.trim();
  const shot_date = (body.shot_date as string | undefined)?.trim();

  if (!title || !shot_date) {
    return NextResponse.json(
      { error: "Missing required fields: title, shot_date." },
      { status: 400 }
    );
  }

  const baseSlug = generateSlug(title);

  const { data: existing } = await supabaseAdmin
    .from("photo_chapters")
    .select("slug")
    .like("slug", `${baseSlug}%`);

  const slugs = new Set((existing ?? []).map((r: { slug: string }) => r.slug));
  let slug = baseSlug;
  let counter = 2;
  while (slugs.has(slug)) {
    slug = `${baseSlug}-${counter++}`;
  }

  const { data, error } = await supabaseAdmin
    .from("photo_chapters")
    .insert({
      title,
      slug,
      description: (body.description as string | undefined)?.trim() || null,
      location: (body.location as string | undefined)?.trim() || null,
      latitude: body.latitude != null ? Number(body.latitude) : null,
      longitude: body.longitude != null ? Number(body.longitude) : null,
      shot_date,
      is_published: body.is_published ?? false,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, chapter: data });
}
