export type ArtworkType = "sculpture" | "painting" | "drawing";

export interface Artwork {
  id: string;
  title: string;
  description: string | null;
  type: ArtworkType;
  year: number | null;
  price: number | null;
  is_sold: boolean;
  is_published: boolean;
  order_index: number | null;
  dimensions: string | null;
  material: string | null;
  technique: string | null;
  edition_info: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArtworkImage {
  id: string;
  artwork_id: string;
  image_url: string;
  storage_path: string;
  order_index: number;
  is_main: boolean;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

export interface ArtworkWithImages extends Artwork {
  artwork_images: ArtworkImage[];
}
