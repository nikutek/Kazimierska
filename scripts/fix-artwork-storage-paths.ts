import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const BUCKET_NAME = "artworks";
const OLD_PREFIXES = ["sculpture/", "painting/", "drawing/"];

function normalizeStoragePath(path: string): string {
  for (const prefix of OLD_PREFIXES) {
    if (path.startsWith(prefix)) {
      return path.slice(prefix.length);
    }
  }
  return path;
}

function normalizeImageUrl(url: string): string {
  let next = url;
  for (const prefix of OLD_PREFIXES) {
    const segment = `/${BUCKET_NAME}/${prefix}`;
    const replacement = `/${BUCKET_NAME}/`;
    next = next.replace(segment, replacement);
  }
  return next;
}

async function fixArtworkStoragePaths() {
  const applyChanges = process.argv.includes("--apply");

  console.log(
    applyChanges
      ? "Applying updates to artworks image paths..."
      : "Dry run mode. Use --apply to persist changes.",
  );

  const { data: artworks, error } = await supabase
    .from("artworks")
    .select("id, title, image_url, storage_path")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  if (!artworks || artworks.length === 0) {
    console.log("No artworks found.");
    return;
  }

  const updates = artworks
    .map((artwork) => {
      const nextStoragePath = normalizeStoragePath(artwork.storage_path ?? "");
      const nextImageUrl = normalizeImageUrl(artwork.image_url ?? "");

      const changed =
        nextStoragePath !== artwork.storage_path ||
        nextImageUrl !== artwork.image_url;

      if (!changed) {
        return null;
      }

      return {
        id: artwork.id,
        title: artwork.title,
        oldStoragePath: artwork.storage_path,
        newStoragePath: nextStoragePath,
        oldImageUrl: artwork.image_url,
        newImageUrl: nextImageUrl,
      };
    })
    .filter(Boolean) as Array<{
    id: string;
    title: string | null;
    oldStoragePath: string;
    newStoragePath: string;
    oldImageUrl: string;
    newImageUrl: string;
  }>;

  console.log(`Found ${updates.length} rows requiring updates.`);

  if (updates.length === 0) {
    return;
  }

  for (const row of updates.slice(0, 10)) {
    console.log(
      `- ${row.title ?? row.id}\n  storage_path: ${row.oldStoragePath} -> ${row.newStoragePath}\n  image_url: ${row.oldImageUrl} -> ${row.newImageUrl}`,
    );
  }

  if (updates.length > 10) {
    console.log(`...and ${updates.length - 10} more rows`);
  }

  if (!applyChanges) {
    console.log("Dry run complete. No changes were written.");
    return;
  }

  let updatedCount = 0;
  for (const row of updates) {
    const { error: updateError } = await supabase
      .from("artworks")
      .update({
        storage_path: row.newStoragePath,
        image_url: row.newImageUrl,
      })
      .eq("id", row.id);

    if (updateError) {
      console.error(
        `Failed to update ${row.title ?? row.id}: ${updateError.message}`,
      );
      continue;
    }

    updatedCount++;
  }

  console.log(`Update complete. Updated ${updatedCount}/${updates.length} rows.`);
}

fixArtworkStoragePaths().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
