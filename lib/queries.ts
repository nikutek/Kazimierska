import { supabase } from "./supabase";
import { ArtworkWithImages } from "../types/database";

export async function getFeaturedArtwork(): Promise<ArtworkWithImages | null> {
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

  return data as ArtworkWithImages;
}
