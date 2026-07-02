export type ArtworkType = "sculpture" | "painting" | "drawing";

export interface PhotoChapter {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  shot_date: string;
  is_published: boolean;
  created_at: string;
}

export interface Photo {
  id: string;
  chapter_id: string;
  image_url: string;
  storage_path: string;
  is_published: boolean;
  created_at: string;
}

export interface Artwork {
  id: string;
  title: string;
  description: string | null;
  type: ArtworkType;
  image_url: string;
  storage_path: string;
  year: number | null;
  price: number | null;
  is_sold: boolean;
  is_published: boolean;
  order_index: number | null;
  dimensions: string | null;
  material: string | null;
  technique: string | null;
  created_at: string;
  updated_at: string;
}
