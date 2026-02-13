import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getArtworks, getArtworkById } from "@/lib/queries";
import { ArtworkType, Artwork } from "../../types/database";

// Query keys
export const artworkKeys = {
  all: ["artworks"] as const,
  lists: () => [...artworkKeys.all, "list"] as const,
  list: (filter?: ArtworkType) => [...artworkKeys.lists(), { filter }] as const,
  details: () => [...artworkKeys.all, "detail"] as const,
  detail: (id: string) => [...artworkKeys.details(), id] as const,
};

// Hook do pobierania wszystkich artworks
export function useArtworks(type?: ArtworkType) {
  return useQuery({
    queryKey: artworkKeys.list(type),
    queryFn: () => getArtworks(type),
  });
}

// Hook do pobierania pojedynczego artwork
export function useArtwork(id: string) {
  return useQuery({
    queryKey: artworkKeys.detail(id),
    queryFn: () => getArtworkById(id),
    enabled: !!id, // Query nie wykona się jeśli id jest puste
  });
}

// Przykład mutation (jeśli będziesz dodawać/edytować artworks)
export function useCreateArtwork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (artwork: Partial<Artwork>) => {
      // Tutaj będzie funkcja do dodawania artwork
      // np. createArtwork(artwork)
      return artwork;
    },
    onSuccess: () => {
      // Invalidate queries żeby odświeżyć listę
      queryClient.invalidateQueries({ queryKey: artworkKeys.lists() });
    },
  });
}
