import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface FileMetadata {
  name: string;
  type: "sculpture" | "painting" | "drawing";
  title?: string;
  year?: number;
  material?: string;
}

// Funkcja do określenia typu na podstawie nazwy pliku lub folderu
function getArtworkType(
  filePath: string,
): "sculpture" | "painting" | "drawing" {
  const lowerPath = filePath.toLowerCase();

  if (lowerPath.includes("sculpture") || lowerPath.includes("rzezb")) {
    return "sculpture";
  } else if (lowerPath.includes("painting") || lowerPath.includes("obraz")) {
    return "painting";
  } else if (
    lowerPath.includes("drawing") ||
    lowerPath.includes("grafik") ||
    lowerPath.includes("rysun")
  ) {
    return "drawing";
  }

  // Domyślnie sculpture
  return "sculpture";
}

// Funkcja do ekstrakcji tytułu z nazwy pliku
function extractTitle(fileName: string): string {
  // Usuń rozszerzenie
  const nameWithoutExt = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, "");

  // Usuń foldery z ścieżki
  const baseName = nameWithoutExt.split("/").pop() || nameWithoutExt;

  // Zamień podkreślniki i myślniki na spacje
  const readable = baseName.replace(/[_-]/g, " ");

  // Capitalize first letter of each word
  return readable
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

async function importArtworks() {
  try {
    console.log("🎨 Rozpoczynam import dzieł...");

    // 1. Pobierz wszystkie pliki z bucketu
    const { data: files, error: listError } = await supabase.storage
      .from("artworks")
      .list("", {
        limit: 1000,
        sortBy: { column: "name", order: "asc" },
      });

    if (listError) {
      throw listError;
    }

    console.log(`📁 Znaleziono ${files.length} plików`);

    let imported = 0;
    let skipped = 0;

    // 2. Dla każdego pliku stwórz rekord
    for (const file of files) {
      // Pomiń foldery i pliki systemowe
      if (file.id === null || file.name.startsWith(".")) {
        skipped++;
        continue;
      }

      const filePath = file.name;

      // Pobierz publiczny URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("artworks").getPublicUrl(filePath);

      // Określ typ i tytuł
      const type = getArtworkType(filePath);
      const title = extractTitle(filePath);

      // Sprawdź czy już istnieje (po storage_path)
      const { data: existing } = await supabase
        .from("artworks")
        .select("id")
        .eq("storage_path", filePath)
        .single();

      if (existing) {
        console.log(`⏭️  Pomijam "${title}" - już istnieje`);
        skipped++;
        continue;
      }

      // Dodaj do bazy
      const { error: insertError } = await supabase.from("artworks").insert({
        title,
        type,
        image_url: publicUrl,
        storage_path: filePath,
        is_published: true,
        order_index: imported,
      });

      if (insertError) {
        console.error(`❌ Błąd przy "${title}":`, insertError.message);
        continue;
      }

      console.log(`✅ Zaimportowano: ${title} (${type})`);
      imported++;
    }

    console.log("\n🎉 Import zakończony!");
    console.log(`✅ Zaimportowano: ${imported}`);
    console.log(`⏭️  Pominięto: ${skipped}`);
  } catch (error) {
    console.error("❌ Błąd podczas importu:", error);
  }
}

// Uruchom import
importArtworks();
