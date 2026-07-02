import { useQuery } from "@tanstack/react-query";
import { getPhotoChapters, getChapterPhotos } from "@/lib/queries";

export const photoKeys = {
  chapters: ["photo_chapters"] as const,
  photos: (chapterId: string) => ["photos", chapterId] as const,
};

export function usePhotoChapters() {
  return useQuery({
    queryKey: photoKeys.chapters,
    queryFn: getPhotoChapters,
  });
}

export function useChapterPhotos(chapterId: string) {
  return useQuery({
    queryKey: photoKeys.photos(chapterId),
    queryFn: () => getChapterPhotos(chapterId),
    enabled: !!chapterId,
  });
}
