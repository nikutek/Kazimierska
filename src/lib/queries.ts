import { supabase } from "./supabase";
import { Artwork, ArtworkType, PhotoChapter, Photo } from "../../types/database";

export async function getFeaturedArtwork(): Promise<Artwork | null> {
  const { data, error } = await supabase
    .from("artworks")
    .select(
      `
      *,
      artwork_images (*)
    `,
    )
    .eq("is_published", true)
    .order("order_index", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching featured artwork:", error);
    return null;
  }

  return data as Artwork;
}

export async function getArtworks(type?: ArtworkType): Promise<Artwork[]> {
  let query = supabase
    .from("artworks")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching artworks:", error);
    return [];
  }

  return data || [];
}

export async function getPhotoChapters(): Promise<PhotoChapter[]> {
  const { data, error } = await supabase
    .from("photo_chapters")
    .select("*")
    .eq("is_published", true)
    .order("shot_date", { ascending: false });

  if (error) {
    console.error("Error fetching photo chapters:", error);
    return [];
  }

  return data || [];
}

export async function getPhotoChapterBySlug(slug: string): Promise<PhotoChapter | null> {
  const { data, error } = await supabase
    .from("photo_chapters")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) return null;
  return data;
}

export async function getChapterPhotos(chapterId: string): Promise<Photo[]> {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("chapter_id", chapterId)
    .eq("is_published", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching photos:", error);
    return [];
  }

  return data || [];
}

export async function getArtworkById(id: string): Promise<Artwork | null> {
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching artwork:", error);
    return null;
  }

  return data;
}
