export type ArtworkType = "sculpture" | "painting" | "drawing";

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
